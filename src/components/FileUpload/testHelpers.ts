import { act } from "@testing-library/react";
import { FileUploadLabels } from "./types";

export const labels: FileUploadLabels = {
    cancelFile: "Cancel upload",
    continueUpload: "Continue uploads",
    browse: "browse files",
    dropHereOr: "Drop files here or",
    uploadProgress: "Upload progress",
    overallUploadProgress: "Overall upload progress",
    fileUploadProgress: (file) => `Upload progress for ${file.name}`,
    completedFiles: (completed, total) => `${completed} of ${total} files completed`,
    retry: "Retry",
    stopUploads: "Stop uploads",
    uploadCancelled: "Upload cancelled",
    removeFile: "Remove",
    removedFile: (file) => `${file.name} removed`,
    selectedFile: (file) => `${file.name} selected`,
    uploadedFile: (file) => `${file.name} uploaded`,
    formatError: ({ kind, error }) =>
        kind === "response" ? `Invalid response: ${error.message}` : `Upload failed: ${error.message}`,
};

export class ControlledXMLHttpRequest {
    static requests: ControlledXMLHttpRequest[] = [];

    method = "";
    url = "";
    requestBody: Document | XMLHttpRequestBodyInit | null = null;
    requestHeaders: Record<string, string> = {};
    response: unknown;
    responseText = "";
    responseType: XMLHttpRequestResponseType = "";
    status = 0;
    statusText = "";
    withCredentials = false;
    aborted = false;
    sent = false;
    onabort: (() => void | Promise<void>) | null = null;
    onerror: (() => void | Promise<void>) | null = null;
    onload: (() => void | Promise<void>) | null = null;
    upload = { onprogress: null as ((event: ProgressEvent) => void) | null };

    constructor() {
        ControlledXMLHttpRequest.requests.push(this);
    }

    abort() {
        this.aborted = true;
        void this.onabort?.();
    }

    open(method: string, url: string) {
        this.method = method;
        this.url = url;
    }

    send(body: Document | XMLHttpRequestBodyInit | null) {
        this.requestBody = body;
        this.sent = true;
    }

    setRequestHeader(name: string, value: string) {
        this.requestHeaders[name] = value;
    }

    progress(loaded: number, total: number) {
        this.upload.onprogress?.({ lengthComputable: true, loaded, total } as ProgressEvent);
    }

    async fail(message: string) {
        this.statusText = message;
        await this.onerror?.();
    }

    async respond(status: number, responseText: string) {
        this.status = status;
        this.responseText = responseText;
        await this.onload?.();
    }
}

class ControlledFormData {
    append() {}
}

const NativeXMLHttpRequest = global.XMLHttpRequest;
const NativeFormData = global.FormData;
const nativeAbortSignalAny = AbortSignal.any;

const combineAbortSignals = (signals: AbortSignal[]): AbortSignal => {
    const controller = new AbortController();
    signals.forEach((signal) => {
        if (signal.aborted) controller.abort();
        else signal.addEventListener("abort", () => controller.abort(), { once: true });
    });
    return controller.signal;
};

export const completeRequest = async (request: ControlledXMLHttpRequest, status: number, responseText: string) => {
    await act(async () => {
        await request.respond(status, responseText);
        await new Promise((resolve) => setTimeout(resolve, 0));
    });
};

export const failRequest = async (request: ControlledXMLHttpRequest, message: string) => {
    await act(async () => {
        await request.fail(message);
        await new Promise((resolve) => setTimeout(resolve, 0));
    });
};

beforeEach(() => {
    ControlledXMLHttpRequest.requests = [];
    global.XMLHttpRequest = ControlledXMLHttpRequest as unknown as typeof XMLHttpRequest;
    window.XMLHttpRequest = ControlledXMLHttpRequest as unknown as typeof XMLHttpRequest;
    global.FormData = ControlledFormData as unknown as typeof FormData;
    window.FormData = ControlledFormData as unknown as typeof FormData;
    AbortSignal.any = combineAbortSignals;
});

afterEach(() => {
    jest.restoreAllMocks();
    global.XMLHttpRequest = NativeXMLHttpRequest;
    window.XMLHttpRequest = NativeXMLHttpRequest;
    global.FormData = NativeFormData;
    window.FormData = NativeFormData;
    AbortSignal.any = nativeAbortSignalAny;
});
