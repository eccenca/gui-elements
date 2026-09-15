export interface FileUploadHandle {
    upload(): Promise<void>;
    cancel(): void;
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

export type FileUploadErrorKind = "restriction" | "response" | "transport" | "cancelled";

export interface FileUploadError {
    kind: FileUploadErrorKind;
    error: Error;
    file?: FileUploadFile;
    status?: number;
}

export interface FileUploadLabels {
    dropHereOr: string;
    browse: string;
    selectedFile?: (file: FileUploadFile) => string;
    restrictionError?: (error: Error, file?: FileUploadFile) => string;
}

export interface FileUploadResponseMetadata {
    status: number;
    responseText: string;
}

export type FileUploadEndpoint = string | ((file: FileUploadFile) => string);
export type FileUploadHeaders = Record<string, string> | (() => Record<string, string>);

export interface FileUploadProps<T = string> {
    /** Stable ID for the widget. A unique ID is generated when omitted. */
    id?: string;
    /** Localized accessible name, displayed as the widget label by default. */
    name: string;
    /** Hides the widget label visually while retaining it as its accessible name. */
    hideName?: boolean;
    /** Localized selection labels. */
    labels: FileUploadLabels;
    /** Additional localized file restrictions or interaction instructions. */
    instructions?: string;
    endpoint: FileUploadEndpoint;
    acceptedFileTypes?: string[];
    maxFileSize?: number;
    maxNumberOfFiles?: number;
    autoUpload?: boolean;
    method?: "POST" | "PUT";
    headers?: FileUploadHeaders;
    parseResponse?: (metadata: FileUploadResponseMetadata) => T;
    onUploadStart?: () => void;
    onUploadProgress?: (percentage: number) => void;
    onUploadSuccess?: (response: FileUploadResponse<T>) => void;
    onUploadError?: (error: FileUploadError) => void;
    onUploadEnd?: () => void;
    disabled?: boolean;
}
