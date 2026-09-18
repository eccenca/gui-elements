import Uppy, { UppyFile } from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";

import {
    FileUploadError,
    FileUploadFile,
    FileUploadHandle,
    FileUploadParsedProps,
    FileUploadResponse,
    FileUploadRestriction,
    FileUploadResult,
    FileUploadState,
} from "./types";

type UploadBody = { value: unknown };
type UploadUppyFile = UppyFile<Record<string, unknown>, UploadBody>;

type EntryState =
    | { status: "pendingApproval"; controller: AbortController }
    | { status: "queued"; order: number }
    | { status: "uploading"; transportId: string }
    | { status: "complete"; response: FileUploadResponse<unknown> }
    | { status: "error"; error: FileUploadError }
    | { status: "cancelled" };

interface Entry {
    file: FileUploadFile;
    data: Blob;
    selectionKey: string;
    approved: boolean;
    bytesUploaded: number;
    state: EntryState;
}

export interface UploadRow {
    file: FileUploadFile;
    status: EntryState["status"];
    progress: number;
}

interface UploadView {
    files: readonly UploadRow[];
    state: Readonly<FileUploadState>;
    error?: FileUploadError;
    announcement: string;
}

class ResponseParseError extends Error {
    readonly cause: Error;
    readonly status: number;

    constructor(cause: Error, status: number) {
        super(cause.message);
        this.cause = cause;
        this.status = status;
        this.name = "ResponseParseError";
    }
}

const asError = (value: unknown): Error => (value instanceof Error ? value : new Error(String(value)));
const percentage = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
const publicFile = (file: UploadUppyFile): FileUploadFile => ({
    id: file.id,
    name: file.name ?? "",
    type: file.type,
    size: file.size ?? undefined,
});

/** Owns the selection and scheduler. Uppy holds only files currently handed to transport. */
export class UploadController implements FileUploadHandle<unknown> {
    readonly uppy: Uppy<Record<string, unknown>, UploadBody>;
    private readonly props: () => FileUploadParsedProps<unknown>;
    private entries = new Map<string, Entry>();
    private listeners = new Set<() => void>();
    private sequence = 0;
    private dispatchId?: string;
    private scheduled = false;
    private disposed = false;
    private attached = true;
    private enabled = false;
    private batch?: {
        promise: Promise<FileUploadResult<unknown>>;
        resolve: (result: FileUploadResult<unknown>) => void;
    };
    private view: UploadView = {
        files: [],
        announcement: "",
        state: {
            pendingApproval: 0,
            queued: 0,
            uploading: 0,
            completed: 0,
            failed: 0,
            cancelled: 0,
            progress: 0,
            allSuccessful: false,
        },
    };

    constructor(id: string, props: () => FileUploadParsedProps<unknown>) {
        this.props = props;
        this.uppy = new Uppy<Record<string, unknown>, UploadBody>({
            id,
            autoProceed: false,
            onBeforeFileAdded: (file) => (this.dispatchId ? { ...file, id: this.dispatchId } : file),
        }).use(XHRUpload, {
            limit: Number.POSITIVE_INFINITY,
            endpoint: (file) => {
                const selected = Array.isArray(file) ? undefined : this.transportEntry(file.id);
                if (!selected) throw new Error("Upload was cancelled");
                const endpoint = this.props().endpoint;
                return typeof endpoint === "function" ? endpoint(selected.file) : endpoint;
            },
            headers: () => {
                const headers = this.props().headers;
                return typeof headers === "function" ? headers() : (headers ?? {});
            },
            getResponseData: (xhr) => {
                try {
                    // The envelope prevents Uppy from substituting its parser for a null/undefined result.
                    return {
                        value: this.props().parseResponse({ status: xhr.status, responseText: xhr.responseText }),
                    };
                } catch (error) {
                    throw new ResponseParseError(asError(error), xhr.status);
                }
            },
        });
        this.uppy.on("files-added", this.filesAdded);
        this.uppy.on("restriction-failed", (file, error) => {
            if (!this.dispatchId)
                this.reportError({
                    kind: "restriction",
                    error,
                    file: file ? publicFile(file) : undefined,
                    restriction: this.restrictionDetails(error, file ? publicFile(file) : undefined),
                });
        });
        this.uppy.on("upload-progress", (file, progress) => {
            const entry = file && this.transportEntry(file.id);
            if (!entry) return;
            entry.bytesUploaded = Math.min(entry.file.size ?? progress.bytesUploaded, progress.bytesUploaded);
            this.publish();
        });
        this.uppy.on("upload-success", (file, response) => {
            const entry = file && this.transportEntry(file.id);
            if (!entry) return;
            const result = { file: entry.file, status: response.status, body: response.body?.value };
            entry.state = { status: "complete", response: result };
            entry.bytesUploaded = entry.file.size ?? 0;
            this.uppy.removeFile(file.id);
            this.view = { ...this.view, announcement: this.props().labels.uploadedFile(entry.file) };
            this.publish();
            if (!this.disposed && this.entries.get(entry.file.id) === entry) this.props().onUploadSuccess?.(result);
            this.schedule();
        });
        this.uppy.on("upload-error", (file, error, response) => {
            const entry = file && this.transportEntry(file.id);
            if (!entry) return;
            const parseError = error instanceof ResponseParseError;
            this.fail(entry, {
                kind: parseError ? "response" : "transport",
                error,
                file: entry.file,
                status: parseError ? error.status : response?.status,
            });
        });
        this.configure();
    }

    getSnapshot = (): UploadView => this.view;
    attach = (): (() => void) => {
        this.attached = true;
        return () => {
            this.attached = false;
            // React StrictMode reattaches effects synchronously. Suppress callbacks immediately,
            // but only destroy the transport if this is an actual unmount.
            queueMicrotask(() => {
                if (!this.attached) this.dispose();
            });
        };
    };
    subscribe = (listener: () => void): (() => void) => {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    };

    configure = (): void => {
        const props = this.props();
        this.uppy.setOptions({
            restrictions: {
                allowedFileTypes: props.acceptedFileTypes,
                maxFileSize: props.maxFileSize,
                maxNumberOfFiles: props.maxNumberOfFiles === null ? undefined : (props.maxNumberOfFiles ?? 1),
            },
        });
        this.uppy.getPlugin("XHRUpload")?.setOptions({ method: props.method ?? "POST" });
        this.schedule();
    };

    addInitialFiles = (files: readonly File[]): void => {
        this.uppy.addFiles(files.map((data) => ({ data, name: data.name, type: data.type })));
    };

    private filesAdded = (files: UploadUppyFile[]): void => {
        if (this.dispatchId || this.disposed || files.length === 0) return;
        // Detach selection from transport immediately. Approval and manual mode never hold XHR slots.
        files.forEach((file) => this.uppy.removeFile(file.id));
        const retained = [...this.entries.values()].filter((entry) => entry.state.status !== "complete");
        const maximum = this.props().maxNumberOfFiles === null ? Infinity : (this.props().maxNumberOfFiles ?? 1);
        if (retained.length + files.length > maximum) {
            this.reportError({
                kind: "restriction",
                restriction: { code: "maxNumberOfFiles", maxNumberOfFiles: maximum },
                error: new Error(this.uppy.i18n("youCanOnlyUploadX", { smart_count: maximum })),
            });
            return;
        }
        const accepted: Entry[] = [];
        for (const file of files) {
            if (file.isRemote || !file.data) continue;
            if (retained.some((entry) => entry.selectionKey === file.id)) {
                this.reportError({
                    kind: "restriction",
                    restriction: { code: "duplicate" },
                    file: publicFile(file),
                    error: new Error(this.uppy.i18n("noDuplicates", { fileName: file.name ?? "" })),
                });
                continue;
            }
            const entry: Entry = {
                file: { ...publicFile(file), id: `${file.id}-${++this.sequence}` },
                data: file.data,
                selectionKey: file.id,
                approved: false,
                bytesUploaded: 0,
                state: { status: "pendingApproval", controller: new AbortController() },
            };
            this.entries.set(entry.file.id, entry);
            accepted.push(entry);
        }
        if (!accepted.length) return;
        this.openBatch();
        this.view = {
            ...this.view,
            error: undefined,
            announcement: accepted.map((entry) => this.props().labels.selectedFile(entry.file)).join(". "),
        };
        this.publish();
        this.props().onFilesAdded?.(accepted.map((entry) => entry.file));
        accepted.forEach((entry) => this.approve(entry));
    };

    private approve(entry: Entry): void {
        if (entry.state.status !== "pendingApproval") return;
        const { controller } = entry.state;
        const isCurrent = () =>
            this.attached && !this.disposed && !controller.signal.aborted && this.entries.get(entry.file.id) === entry;
        const accept = (approved: boolean) => {
            if (!isCurrent()) return;
            if (approved) {
                entry.approved = true;
                entry.state = { status: "queued", order: ++this.sequence };
            } else {
                this.entries.delete(entry.file.id);
            }
            this.publish();
            this.schedule();
        };
        const beforeUpload = this.props().beforeUpload;
        if (!beforeUpload) {
            accept(true);
            return;
        }
        Promise.resolve()
            .then(() => (isCurrent() ? beforeUpload(entry.file, controller.signal) : false))
            .then(accept, (error) => {
                if (isCurrent()) this.fail(entry, { kind: "validation", error: asError(error), file: entry.file });
            });
    }

    private openBatch(): void {
        if (this.batch) return;
        let resolve!: (result: FileUploadResult<unknown>) => void;
        const promise = new Promise<FileUploadResult<unknown>>((done) => {
            resolve = done;
        });
        this.batch = { promise, resolve };
        this.enabled = this.props().autoUpload !== false;
    }

    upload = (): Promise<FileUploadResult<unknown>> => {
        if (this.props().disabled) return Promise.reject(new Error("File upload is disabled"));
        if (!this.batch) return Promise.resolve(this.result("settled"));
        this.enabled = true;
        this.schedule();
        return this.batch.promise;
    };

    private schedule(): void {
        if (this.scheduled || this.disposed) return;
        this.scheduled = true;
        queueMicrotask(() => {
            this.scheduled = false;
            if (this.disposed || !this.attached) return;
            const props = this.props();
            if (!props.disabled && (this.enabled || props.autoUpload !== false)) {
                const concurrency = Math.max(1, props.concurrency ?? 1);
                const ready = [...this.entries.values()]
                    .filter((entry) => entry.state.status === "queued")
                    .sort(
                        (a, b) =>
                            (a.state.status === "queued" ? a.state.order : 0) -
                            (b.state.status === "queued" ? b.state.order : 0),
                    );
                for (const entry of ready) {
                    if (this.disposed || this.props().disabled || this.view.state.uploading >= concurrency) break;
                    if (this.entries.get(entry.file.id) === entry && entry.state.status === "queued") this.start(entry);
                }
            }
            this.settle();
        });
    }

    private start(entry: Entry): void {
        const transportId = `${entry.file.id}-request-${++this.sequence}`;
        entry.state = { status: "uploading", transportId };
        this.dispatchId = transportId;
        try {
            this.uppy.addFile({ data: entry.data, name: entry.file.name, type: entry.file.type });
        } catch (error) {
            const diagnostic = asError(error);
            this.fail(entry, {
                kind: "restriction",
                error: diagnostic,
                file: entry.file,
                restriction: this.restrictionDetails(diagnostic, entry.file),
            });
            return;
        } finally {
            this.dispatchId = undefined;
        }
        this.publish();
        if (this.transportEntry(transportId) !== entry) return;
        void this.uppy.upload().catch((error) => {
            if (this.transportEntry(transportId) === entry) {
                this.fail(entry, { kind: "transport", error: asError(error), file: entry.file });
            }
        });
    }

    private restrictionDetails(error: Error, file?: FileUploadFile): FileUploadRestriction {
        if (!("isRestriction" in error) || !error.isRestriction) return { code: "unknown" };
        const { maxFileSize, acceptedFileTypes, maxNumberOfFiles = 1 } = this.props();
        // Uppy is configured with only size/type (file) and count (selection) restrictions.
        // Derive a violated rule from inputs, never from Uppy message text. If both size and type
        // fail, report size first; after it is fixed, type validation still applies.
        if (file) {
            if (maxFileSize && file.size !== undefined && file.size > maxFileSize) {
                return { code: "maxFileSize", maxFileSize };
            }
            if (acceptedFileTypes) return { code: "fileType", acceptedFileTypes: [...acceptedFileTypes] };
        } else if (maxNumberOfFiles) {
            return { code: "maxNumberOfFiles", maxNumberOfFiles };
        }
        return { code: "unknown" };
    }

    private transportEntry(id: string): Entry | undefined {
        if (this.disposed || !this.attached) return undefined;
        return [...this.entries.values()].find(
            (entry) => entry.state.status === "uploading" && entry.state.transportId === id,
        );
    }

    private interrupt(entry: Entry): void {
        const previous = entry.state;
        entry.state = { status: "cancelled" };
        entry.bytesUploaded = 0;
        if (previous.status === "pendingApproval") previous.controller.abort();
        if (previous.status === "uploading") this.uppy.removeFile(previous.transportId);
    }

    cancelFile = (id: string): void => {
        const entry = this.entries.get(id);
        if (!entry || entry.state.status === "complete" || entry.state.status === "cancelled") return;
        this.interrupt(entry);
        this.publish();
        this.schedule();
    };

    stop = (): void => {
        for (const entry of this.entries.values()) {
            if (entry.state.status !== "complete" && entry.state.status !== "error") this.interrupt(entry);
        }
        this.publish();
        this.settle();
    };

    retry = (id: string): void => {
        const entry = this.entries.get(id);
        if (this.props().disabled || !entry || !["error", "cancelled"].includes(entry.state.status)) return;
        this.openBatch();
        this.enabled = true;
        entry.bytesUploaded = 0;
        entry.state = entry.approved
            ? { status: "queued", order: ++this.sequence }
            : { status: "pendingApproval", controller: new AbortController() };
        this.view = { ...this.view, error: undefined };
        this.approve(entry);
        this.publish();
        this.schedule();
    };

    continue = (): void => {
        for (const entry of this.entries.values()) if (entry.state.status === "cancelled") this.retry(entry.file.id);
    };

    remove = (id: string): void => {
        const entry = this.entries.get(id);
        if (!entry) return;
        this.entries.delete(id);
        this.interrupt(entry);
        this.view = { ...this.view, announcement: this.props().labels.removedFile(entry.file) };
        this.publish();
        this.schedule();
    };

    cancel = (): void => {
        for (const entry of this.entries.values()) if (entry.state.status !== "complete") this.interrupt(entry);
        const result = this.result("cancelled");
        const batch = this.batch;
        this.batch = undefined;
        this.entries.clear();
        this.view = { ...this.view, announcement: "" };
        this.publish();
        batch?.resolve(result);
        if (batch && !this.disposed) this.props().onComplete?.(result);
    };

    reset = (): void => {
        this.view = { ...this.view, error: undefined };
        this.cancel();
    };

    dispose = (): void => {
        this.disposed = true;
        this.cancel();
        this.listeners.clear();
        this.uppy.destroy();
    };

    private fail(entry: Entry, error: FileUploadError): void {
        this.interrupt(entry);
        entry.state = { status: "error", error };
        this.reportError(error);
        this.schedule();
    }

    private reportError(error: FileUploadError): void {
        if (this.disposed || !this.attached) return;
        this.view = { ...this.view, error };
        this.publish();
        this.props().onUploadError?.(error);
    }

    private result(reason: FileUploadResult<unknown>["reason"]): FileUploadResult<unknown> {
        const successful: FileUploadResponse<unknown>[] = [];
        const failed: FileUploadError[] = [];
        const cancelled: FileUploadFile[] = [];
        for (const entry of this.entries.values()) {
            if (entry.state.status === "complete") successful.push(entry.state.response);
            if (entry.state.status === "error") failed.push(entry.state.error);
            if (entry.state.status === "cancelled") cancelled.push(entry.file);
        }
        return { reason, successful, failed, cancelled };
    }

    private settle(): void {
        const { pendingApproval, queued, uploading } = this.view.state;
        if (!this.batch || pendingApproval || queued || uploading) return;
        const batch = this.batch;
        this.batch = undefined;
        const result = this.result("settled");
        batch.resolve(result);
        this.props().onComplete?.(result);
    }

    private publish(): void {
        if (this.disposed || !this.attached) return;
        const state: FileUploadState = {
            pendingApproval: 0,
            queued: 0,
            uploading: 0,
            completed: 0,
            failed: 0,
            cancelled: 0,
            progress: 0,
            allSuccessful: false,
        };
        let bytesTotal = 0,
            bytesUploaded = 0,
            approved = 0;
        const files = [...this.entries.values()].map((entry) => {
            const { status } = entry.state;
            if (status === "complete") state.completed++;
            else if (status === "error") state.failed++;
            else state[status]++;
            if (entry.approved) {
                approved++;
                bytesTotal += entry.file.size ?? 0;
                bytesUploaded += entry.bytesUploaded;
            }
            return {
                file: entry.file,
                status,
                progress:
                    status === "complete"
                        ? 100
                        : entry.file.size
                          ? percentage((entry.bytesUploaded / entry.file.size) * 100)
                          : 0,
            };
        });
        state.progress = bytesTotal
            ? percentage((bytesUploaded / bytesTotal) * 100)
            : approved
              ? percentage((state.completed / approved) * 100)
              : 0;
        state.allSuccessful = files.length > 0 && state.completed === files.length;
        const changed = JSON.stringify(state) !== JSON.stringify(this.view.state);
        this.view = { ...this.view, files, state };
        this.listeners.forEach((listener) => listener());
        if (changed) this.props().onStateChange?.(state);
    }
}
