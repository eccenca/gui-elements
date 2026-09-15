import React from "react";
import UppyCore from "@uppy/core";
import * as UppyReact from "@uppy/react";

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

export interface HeadlessUppy {
    cancelAll(): void;
    destroy(): void;
    off(event: "file-added", callback: (file: HeadlessUppyFile) => void): void;
    off(event: "restriction-failed", callback: (file: HeadlessUppyFile | undefined, error: Error) => void): void;
    on(event: "file-added", callback: (file: HeadlessUppyFile) => void): void;
    on(event: "restriction-failed", callback: (file: HeadlessUppyFile | undefined, error: Error) => void): void;
    setOptions(options: { restrictions: HeadlessUppyRestrictions }): void;
    upload(): Promise<unknown>;
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
export const { UppyContextProvider, useDropzone, useFileInput } = UppyReact as unknown as UppyReactHeadless;
