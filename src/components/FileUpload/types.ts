export interface FileUploadHandle<T = string> {
    /** Starts the current selection; overlapping calls share a result. */
    upload(): Promise<FileUploadResult<T>>;
    /** Cancels pending work and clears the selection, retaining inline errors. */
    cancel(): void;
    /** Removes a local row and pending work; never deletes a server resource. */
    remove(fileId: string): void;
    /** Cancels pending work and clears selection, progress and errors. */
    reset(): void;
}

export interface FileUploadFile {
    id: string;
    name: string;
    type?: string;
    size?: number;
}

export interface FileUploadResponse<T> {
    body: T;
    status: number;
    file: FileUploadFile;
}

export type FileUploadErrorKind = "restriction" | "validation" | "response" | "transport";

export interface FileUploadError {
    kind: FileUploadErrorKind;
    error: Error;
    file?: FileUploadFile;
    status?: number;
}

export interface FileUploadState {
    pendingApproval: number;
    queued: number;
    uploading: number;
    completed: number;
    failed: number;
    cancelled: number;
    progress: number;
    allSuccessful: boolean;
}

/** A snapshot of retained files, not a delta from the previous completion. */
export interface FileUploadResult<T> {
    reason: "settled" | "cancelled";
    successful: readonly FileUploadResponse<T>[];
    failed: readonly FileUploadError[];
    cancelled: readonly FileUploadFile[];
}

export interface FileUploadLabels {
    cancelFile: string;
    continueUpload: string;
    dropHereOr: string;
    browse: string;
    uploadProgress: string;
    overallUploadProgress: string;
    fileUploadProgress: (file: FileUploadFile) => string;
    completedFiles: (completed: number, total: number) => string;
    retry: string;
    removeFile: string;
    removedFile: (file: FileUploadFile) => string;
    stopUploads: string;
    uploadCancelled: string;
    selectedFile: (file: FileUploadFile) => string;
    uploadedFile: (file: FileUploadFile) => string;
    formatError: (error: FileUploadError) => string;
}

export interface FileUploadResponseMetadata {
    status: number;
    responseText: string;
}

export type FileUploadEndpoint = string | ((file: FileUploadFile) => string);
export type FileUploadHeaders = Record<string, string> | (() => Record<string, string>);
export type FileUploadApproval = (file: FileUploadFile, signal: AbortSignal) => Promise<boolean>;

export interface FileUploadBaseProps<T> {
    id?: string;
    /** Localized widget label and accessible name. */
    name: string;
    hideName?: boolean;
    labels: FileUploadLabels;
    instructions?: string;
    endpoint: FileUploadEndpoint;
    acceptedFileTypes?: string[];
    maxFileSize?: number;
    /** Maximum retained incomplete files. Defaults to 1; null removes the restriction. */
    maxNumberOfFiles?: number | null;
    /** Maximum active requests across selections and retries. Defaults to 1. */
    concurrency?: number;
    autoUpload?: boolean;
    /** Initialized once per mount; reset/rerender does not add these files again. */
    initialFiles?: readonly File[];
    beforeUpload?: FileUploadApproval;
    method?: "POST" | "PUT";
    headers?: FileUploadHeaders;
    /** Selection notification only. Use beforeUpload for asynchronous approval. */
    onFilesAdded?: (files: FileUploadFile[]) => void;
    onUploadSuccess?: (response: FileUploadResponse<T>) => void;
    onUploadError?: (error: FileUploadError) => void;
    onStateChange?: (state: Readonly<FileUploadState>) => void;
    onComplete?: (result: FileUploadResult<T>) => void;
    /** Blocks selection and future request starts; cancellation/removal remain available. */
    disabled?: boolean;
    /** Blocks only picker/drop interaction. */
    selectionDisabled?: boolean;
}

export type FileUploadTextProps = FileUploadBaseProps<string> & { parseResponse?: undefined };
export type FileUploadParsedProps<T> = FileUploadBaseProps<T> & {
    parseResponse: (metadata: FileUploadResponseMetadata) => T;
};
export type FileUploadProps<T = string> = FileUploadParsedProps<T> | (string extends T ? FileUploadTextProps : never);
