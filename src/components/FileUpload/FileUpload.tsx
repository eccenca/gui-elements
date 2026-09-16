import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Icon from "../Icon/Icon";
import ProgressBar from "../ProgressBar/ProgressBar";

import {
    FileUploadError,
    FileUploadFile,
    FileUploadHandle,
    FileUploadProps,
    FileUploadResponseMetadata,
} from "./types";
import {
    HeadlessFileProgress,
    HeadlessUppyFile,
    HeadlessUploadResponse,
    Uppy,
    UppyContextProvider,
    useDropzone,
    useFileInput,
    XHRUpload,
} from "./uppyHeadless";

interface UploadFileState {
    file: FileUploadFile;
    progress: number;
    status: "uploading" | "complete" | "error";
}

class ResponseParseError extends Error {
    readonly cause: Error;
    readonly status: number;

    constructor(error: Error, status: number) {
        super(error.message);
        this.name = "ResponseParseError";
        this.cause = error;
        this.status = status;
    }
}

const asError = (error: unknown): Error => (error instanceof Error ? error : new Error(String(error)));
const percentage = (value: number): number => Math.max(0, Math.min(100, Math.round(value)));

const publicFile = (file: { id: string; name?: string; type?: string; size?: number | null }): FileUploadFile => ({
    id: file.id,
    name: file.name ?? "",
    ...(file.type ? { type: file.type } : {}),
    ...(typeof file.size === "number" ? { size: file.size } : {}),
});

interface FileSelectionProps {
    buttonDescriptionIds: string | undefined;
    disabled: boolean;
    labels: FileUploadProps["labels"];
}

const FileSelection = ({ buttonDescriptionIds, disabled, labels }: FileSelectionProps) => {
    const [dragging, setDragging] = React.useState(false);
    const dragEntryCount = React.useRef(0);
    const handleDragEnter = React.useCallback(() => {
        dragEntryCount.current += 1;
        setDragging(true);
    }, []);
    const handleDragLeave = React.useCallback(() => {
        dragEntryCount.current = Math.max(0, dragEntryCount.current - 1);
        if (dragEntryCount.current === 0) {
            setDragging(false);
        }
    }, []);
    const handleDrop = React.useCallback(() => {
        dragEntryCount.current = 0;
        setDragging(false);
    }, []);
    const { getRootProps } = useDropzone({
        noClick: true,
        onDragEnter: handleDragEnter,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop,
    });
    const { getButtonProps, getInputProps } = useFileInput();
    const dropzoneProps = getRootProps();
    const inputProps = getInputProps();
    const buttonProps = getButtonProps();
    const preventDisabledDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <div
            className={
                `${eccgui}-fileupload__dropzone` +
                (dragging ? ` ${eccgui}-fileupload__dropzone--dragging` : "") +
                (disabled ? ` ${eccgui}-fileupload__dropzone--disabled` : "")
            }
            data-dropzone-for="Files"
            data-state={dragging ? "dragging" : disabled ? "disabled" : "idle"}
            onDragEnter={disabled ? preventDisabledDrop : dropzoneProps.onDragEnter}
            onDragLeave={disabled ? preventDisabledDrop : dropzoneProps.onDragLeave}
            onDragOver={disabled ? preventDisabledDrop : dropzoneProps.onDragOver}
            onDrop={disabled ? preventDisabledDrop : dropzoneProps.onDrop}
        >
            <input
                {...inputProps}
                className="cds--visually-hidden"
                disabled={disabled}
                onChange={disabled ? undefined : inputProps.onChange}
                tabIndex={-1}
            />
            <button
                {...buttonProps}
                aria-controls={inputProps.id}
                aria-describedby={buttonDescriptionIds}
                className={`${eccgui}-fileupload__button`}
                disabled={disabled}
                role="button"
            >
                <Icon name="item-upload" aria-hidden="true" />
                <span>{labels.dropHereOr}</span> <strong>{labels.browse}</strong>
            </button>
        </div>
    );
};

function FileUploadInner<T = string>(
    {
        id,
        name,
        hideName = false,
        labels,
        instructions,
        endpoint,
        acceptedFileTypes,
        maxFileSize,
        maxNumberOfFiles = 1,
        concurrency = 1,
        autoUpload = true,
        method = "POST",
        headers,
        parseResponse,
        onUploadStart,
        onUploadProgress,
        onUploadSuccess,
        onUploadError,
        onUploadEnd,
        disabled = false,
    }: FileUploadProps<T>,
    ref: React.ForwardedRef<FileUploadHandle>,
) {
    const generatedId = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
    const widgetId = id ?? `file-upload-${generatedId}`;
    const labelId = `${widgetId}-label`;
    const instructionsId = `${widgetId}-instructions`;
    const errorId = `${widgetId}-error`;
    const progressId = `${widgetId}-progress`;
    const [selectionStatus, setSelectionStatus] = React.useState<string>();
    const [inlineError, setInlineError] = React.useState<string>();
    const [uploadFiles, setUploadFiles] = React.useState<UploadFileState[]>([]);
    const [uploadState, setUploadState] = React.useState({
        active: false,
        completed: 0,
        progress: 0,
        total: 0,
        visible: false,
    });
    const activeBatchRef = React.useRef(false);
    const progressRef = React.useRef(0);
    const uploadPromiseRef = React.useRef<Promise<void>>();
    const propsRef = React.useRef({
        endpoint,
        headers,
        labels,
        onUploadEnd,
        onUploadError,
        onUploadProgress,
        onUploadStart,
        onUploadSuccess,
        parseResponse,
    });
    propsRef.current = {
        endpoint,
        headers,
        labels,
        onUploadEnd,
        onUploadError,
        onUploadProgress,
        onUploadStart,
        onUploadSuccess,
        parseResponse,
    };
    const [uppy] = React.useState(() =>
        new Uppy({
            id: widgetId,
            autoProceed: autoUpload,
            restrictions: { allowedFileTypes: acceptedFileTypes, maxFileSize, maxNumberOfFiles },
        }).use(XHRUpload, {
            endpoint: (file) => {
                const currentEndpoint = propsRef.current.endpoint;
                return typeof currentEndpoint === "function" ? currentEndpoint(publicFile(file)) : currentEndpoint;
            },
            getResponseData: (xhr) => {
                const metadata: FileUploadResponseMetadata = {
                    responseText: xhr.responseText,
                    status: xhr.status,
                };
                try {
                    return propsRef.current.parseResponse?.(metadata) ?? metadata.responseText;
                } catch (error) {
                    throw new ResponseParseError(asError(error), xhr.status);
                }
            },
            headers: () => {
                const currentHeaders = propsRef.current.headers;
                return typeof currentHeaders === "function" ? currentHeaders() : (currentHeaders ?? {});
            },
            limit: concurrency,
            method,
        }),
    );

    React.useEffect(() => {
        uppy.setOptions({
            autoProceed: autoUpload,
            restrictions: { allowedFileTypes: acceptedFileTypes, maxFileSize, maxNumberOfFiles },
        });
        uppy.getPlugin("XHRUpload")?.setOptions({ method });
    }, [acceptedFileTypes, autoUpload, maxFileSize, maxNumberOfFiles, method, uppy]);

    React.useEffect(() => {
        const endBatch = () => {
            if (!activeBatchRef.current) return;
            activeBatchRef.current = false;
            propsRef.current.onUploadEnd?.();
        };
        const handleFileAdded = (file: HeadlessUppyFile) => {
            const selectedFile = publicFile(file);
            setInlineError(undefined);
            setSelectionStatus(propsRef.current.labels.selectedFile?.(selectedFile) ?? selectedFile.name);
        };
        const handleRestrictionFailed = (file: HeadlessUppyFile | undefined, error: Error) => {
            const rejectedFile = file ? publicFile(file) : undefined;
            const uploadError: FileUploadError = {
                kind: "restriction",
                error,
                ...(rejectedFile ? { file: rejectedFile } : {}),
            };
            setInlineError(propsRef.current.labels.restrictionError?.(error, rejectedFile) ?? error.message);
            propsRef.current.onUploadError?.(uploadError);
        };
        const handleUpload = (_uploadId: string, files: HeadlessUppyFile[]) => {
            activeBatchRef.current = true;
            progressRef.current = 0;
            setInlineError(undefined);
            setUploadFiles(
                files.map((file) => ({
                    file: publicFile(file),
                    progress: 0,
                    status: "uploading",
                })),
            );
            setUploadState({
                active: true,
                completed: 0,
                progress: 0,
                total: files.length,
                visible: true,
            });
            propsRef.current.onUploadStart?.();
        };
        const handleProgress = (progress: number) => {
            const currentProgress = percentage(progress);
            progressRef.current = currentProgress;
            setUploadState((state) => ({ ...state, progress: currentProgress }));
            propsRef.current.onUploadProgress?.(currentProgress);
        };
        const handleFileProgress = (file: HeadlessUppyFile | undefined, progress: HeadlessFileProgress) => {
            if (!file || !activeBatchRef.current) return;
            const bytesTotal = progress.bytesTotal ?? file.size;
            const currentProgress = bytesTotal ? percentage((progress.bytesUploaded / bytesTotal) * 100) : 0;
            setUploadFiles((currentFiles) =>
                currentFiles.map((currentFile) =>
                    currentFile.file.id === file.id ? { ...currentFile, progress: currentProgress } : currentFile,
                ),
            );
        };
        const handleUploadSuccess = (file: HeadlessUppyFile | undefined, response: HeadlessUploadResponse) => {
            if (!file || !activeBatchRef.current) return;
            const uploadedFile = publicFile(file);
            setUploadState((state) => ({ ...state, completed: Math.min(state.total, state.completed + 1) }));
            setUploadFiles((currentFiles) =>
                currentFiles.map((currentFile) =>
                    currentFile.file.id === file.id
                        ? { ...currentFile, progress: 100, status: "complete" }
                        : currentFile,
                ),
            );
            setSelectionStatus(propsRef.current.labels.uploadedFile?.(uploadedFile) ?? uploadedFile.name);
            // The public parser contract guarantees T; the compatibility adapter intentionally keeps Uppy body types internal.
            propsRef.current.onUploadSuccess?.({
                body: response.body as T,
                file: uploadedFile,
                status: response.status,
            });
        };
        const handleUploadError = (file: HeadlessUppyFile | undefined, error: Error, response?: XMLHttpRequest) => {
            if (!activeBatchRef.current) return;
            const failedFile = file ? publicFile(file) : undefined;
            const responseFailure = error instanceof ResponseParseError;
            const uploadError: FileUploadError = {
                error,
                kind: responseFailure ? "response" : "transport",
                ...(failedFile ? { file: failedFile } : {}),
                ...(responseFailure || response?.status
                    ? { status: responseFailure ? error.status : response?.status }
                    : {}),
            };
            const formatError = responseFailure
                ? propsRef.current.labels.responseError
                : propsRef.current.labels.transportError;
            setInlineError(formatError?.(error, failedFile) ?? error.message);
            if (file) {
                setUploadFiles((currentFiles) =>
                    currentFiles.map((currentFile) =>
                        currentFile.file.id === file.id ? { ...currentFile, status: "error" } : currentFile,
                    ),
                );
            }
            propsRef.current.onUploadError?.(uploadError);
        };
        const handleComplete = (result: { failed: HeadlessUppyFile[] }) => {
            if (!activeBatchRef.current) return;
            const completedProgress = result.failed.length === 0 ? 100 : progressRef.current;
            setUploadState((state) => ({ ...state, active: false, progress: completedProgress }));
            if (completedProgress !== progressRef.current) {
                progressRef.current = completedProgress;
                propsRef.current.onUploadProgress?.(completedProgress);
            }
            endBatch();
        };
        const handleCancelAll = () => {
            progressRef.current = 0;
            setSelectionStatus(undefined);
            setUploadFiles([]);
            setUploadState({ active: false, completed: 0, progress: 0, total: 0, visible: false });
            endBatch();
        };

        uppy.on("file-added", handleFileAdded);
        uppy.on("restriction-failed", handleRestrictionFailed);
        uppy.on("upload", handleUpload);
        uppy.on("progress", handleProgress);
        uppy.on("upload-progress", handleFileProgress);
        uppy.on("upload-success", handleUploadSuccess);
        uppy.on("upload-error", handleUploadError);
        uppy.on("complete", handleComplete);
        uppy.on("cancel-all", handleCancelAll);
        return () => {
            uppy.off("file-added", handleFileAdded);
            uppy.off("restriction-failed", handleRestrictionFailed);
            uppy.off("upload", handleUpload);
            uppy.off("progress", handleProgress);
            uppy.off("upload-progress", handleFileProgress);
            uppy.off("upload-success", handleUploadSuccess);
            uppy.off("upload-error", handleUploadError);
            uppy.off("complete", handleComplete);
            uppy.off("cancel-all", handleCancelAll);
            uppy.destroy();
        };
    }, [uppy]);

    React.useImperativeHandle(
        ref,
        () => ({
            upload: () => {
                if (disabled) return Promise.resolve();
                if (uploadPromiseRef.current) return uploadPromiseRef.current;
                const uploadPromise = uppy
                    .upload()
                    .then(() => undefined)
                    .finally(() => {
                        if (uploadPromiseRef.current === uploadPromise) uploadPromiseRef.current = undefined;
                    });
                uploadPromiseRef.current = uploadPromise;
                return uploadPromise;
            },
            cancel: () => uppy.cancelAll(),
            reset: () => {
                uppy.cancelAll();
                setSelectionStatus(undefined);
                setInlineError(undefined);
            },
        }),
        [disabled, uppy],
    );

    const descriptionIds = [instructions ? instructionsId : undefined, inlineError ? errorId : undefined]
        .filter(Boolean)
        .join(" ");
    const multipleFiles = uploadState.total > 1;

    return (
        <div
            aria-describedby={descriptionIds || undefined}
            aria-busy={uploadState.active || undefined}
            aria-label={hideName ? name : undefined}
            aria-labelledby={hideName ? undefined : labelId}
            className={`${eccgui}-fileupload`}
            role="group"
        >
            {!hideName && (
                <div className={`${eccgui}-fileupload__label`} id={labelId}>
                    {name}
                </div>
            )}
            <UppyContextProvider uppy={uppy}>
                <FileSelection buttonDescriptionIds={descriptionIds || undefined} disabled={disabled} labels={labels} />
            </UppyContextProvider>
            {uploadState.visible && (
                <div className={`${eccgui}-fileupload__progress`}>
                    {multipleFiles && (
                        <div className={`${eccgui}-fileupload__overall-progress`}>
                            <div className={`${eccgui}-fileupload__progress-header`}>
                                <span id={progressId}>{labels.overallUploadProgress}</span>
                                <span aria-hidden="true">{uploadState.progress}%</span>
                            </div>
                            <div
                                aria-labelledby={progressId}
                                aria-valuemax={100}
                                aria-valuemin={0}
                                aria-valuenow={uploadState.progress}
                                role="progressbar"
                            >
                                <ProgressBar aria-hidden="true" value={uploadState.progress / 100} />
                            </div>
                            <div className={`${eccgui}-fileupload__completed-files`}>
                                {labels.completedFiles(uploadState.completed, uploadState.total)}
                            </div>
                        </div>
                    )}
                    <div aria-label={labels.uploadProgress} className={`${eccgui}-fileupload__file-list`} role="list">
                        {uploadFiles.map((uploadFile) => (
                            <div
                                className={`${eccgui}-fileupload__file`}
                                data-state={uploadFile.status}
                                key={uploadFile.file.id}
                                role="listitem"
                            >
                                <div className={`${eccgui}-fileupload__progress-header`}>
                                    <span>{uploadFile.file.name}</span>
                                    <span aria-hidden="true">{uploadFile.progress}%</span>
                                </div>
                                <div
                                    aria-label={labels.fileUploadProgress(uploadFile.file)}
                                    aria-valuemax={100}
                                    aria-valuemin={0}
                                    aria-valuenow={uploadFile.progress}
                                    role="progressbar"
                                >
                                    <ProgressBar
                                        aria-hidden="true"
                                        animate={uploadFile.status === "uploading"}
                                        intent={
                                            uploadFile.status === "complete"
                                                ? "success"
                                                : uploadFile.status === "error"
                                                  ? "danger"
                                                  : undefined
                                        }
                                        stripes={uploadFile.status === "uploading"}
                                        value={uploadFile.progress / 100}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {instructions && (
                <div className={`${eccgui}-fileupload__instructions`} id={instructionsId}>
                    {instructions}
                </div>
            )}
            {inlineError && (
                <div className={`${eccgui}-fileupload__error`} id={errorId} role="alert">
                    {inlineError}
                </div>
            )}
            {selectionStatus && <div role="status">{selectionStatus}</div>}
        </div>
    );
}

export const FileUpload = React.forwardRef(FileUploadInner) as <T = string>(
    props: FileUploadProps<T> & React.RefAttributes<FileUploadHandle>,
) => React.JSX.Element;

export default FileUpload;
