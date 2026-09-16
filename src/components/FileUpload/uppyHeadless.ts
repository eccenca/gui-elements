import React from "react";
import UppyCore from "@uppy/core";
import * as UppyReact from "@uppy/react";
import XHRUploadCore from "@uppy/xhr-upload";

export interface HeadlessUppyFile {
    id: string;
    name?: string;
    type?: string;
    size?: number | null;
}

interface HeadlessUppyRestrictions {
    allowedFileTypes?: string[];
    maxFileSize?: number;
    maxNumberOfFiles?: number;
}

interface HeadlessUppyOptions {
    id: string;
    autoProceed: boolean;
    restrictions: HeadlessUppyRestrictions;
}

export interface HeadlessUploadResponse {
    body: unknown;
    status: number;
}

export interface HeadlessFileProgress {
    bytesTotal: number | null;
    bytesUploaded: number;
}

interface HeadlessUppyEvents {
    "cancel-all": () => void;
    complete: (result: { failed: HeadlessUppyFile[]; successful: HeadlessUppyFile[] }) => void;
    "file-added": (file: HeadlessUppyFile) => void;
    progress: (percentage: number) => void;
    "restriction-failed": (file: HeadlessUppyFile | undefined, error: Error) => void;
    upload: (uploadId: string, files: HeadlessUppyFile[]) => void;
    "upload-error": (file: HeadlessUppyFile | undefined, error: Error, response?: XMLHttpRequest) => void;
    "upload-progress": (file: HeadlessUppyFile | undefined, progress: HeadlessFileProgress) => void;
    "upload-success": (file: HeadlessUppyFile | undefined, response: HeadlessUploadResponse) => void;
}

interface HeadlessXhrUploadOptions {
    endpoint: (file: HeadlessUppyFile) => string;
    getResponseData: (xhr: XMLHttpRequest) => unknown;
    headers: (file: HeadlessUppyFile) => Record<string, string>;
    method: "POST" | "PUT";
}

interface HeadlessXhrUploadConstructor {
    new (...args: unknown[]): unknown;
}

export interface HeadlessUppy {
    cancelAll(): void;
    destroy(): void;
    getPlugin(id: "XHRUpload"): { setOptions(options: Pick<HeadlessXhrUploadOptions, "method">): void } | undefined;
    off<Event extends keyof HeadlessUppyEvents>(event: Event, callback: HeadlessUppyEvents[Event]): void;
    on<Event extends keyof HeadlessUppyEvents>(event: Event, callback: HeadlessUppyEvents[Event]): void;
    setOptions(options: { autoProceed?: boolean; restrictions?: HeadlessUppyRestrictions }): void;
    upload(): Promise<unknown>;
    use(plugin: HeadlessXhrUploadConstructor, options: HeadlessXhrUploadOptions): HeadlessUppy;
}

interface HeadlessUppyConstructor {
    new (options: HeadlessUppyOptions): HeadlessUppy;
}

interface DropzoneRootProps {
    onDragEnter: React.DragEventHandler<HTMLDivElement>;
    onDragLeave: React.DragEventHandler<HTMLDivElement>;
    onDragOver: React.DragEventHandler<HTMLDivElement>;
    onDrop: React.DragEventHandler<HTMLDivElement>;
}

interface FileInputProps {
    accept?: string;
    id: string;
    multiple: boolean;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    type: "file";
}

interface UppyReactHeadless {
    UppyContextProvider: React.ComponentType<{ children: React.ReactNode; uppy: HeadlessUppy }>;
    useDropzone(options: { noClick: boolean; onDragEnter: () => void; onDragLeave: () => void; onDrop: () => void }): {
        getRootProps(): DropzoneRootProps;
    };
    useFileInput(): {
        getButtonProps(): { onClick: React.MouseEventHandler<HTMLButtonElement>; type: "button" };
        getInputProps(): FileInputProps;
    };
}

// Source consumers can still hoist legacy Uppy declarations during the staged migration.
// Runtime package resolution remains on gui-elements' pinned Uppy 5 dependencies.
export const Uppy = UppyCore as unknown as HeadlessUppyConstructor;
export const XHRUpload = XHRUploadCore as unknown as HeadlessXhrUploadConstructor;
export const { UppyContextProvider, useDropzone, useFileInput } = UppyReact as unknown as UppyReactHeadless;
