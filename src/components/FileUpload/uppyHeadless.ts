import UppyCore from "@uppy/core";
import type BasePlugin from "@uppy/core/lib/BasePlugin";
import type Uppy5 from "@uppy/core/lib/Uppy";
import * as UppyReact from "@uppy/react";
import type * as UppyReact5 from "@uppy/react/lib/index";
import XHRUploadCore from "@uppy/xhr-upload";
import type { XhrUploadOpts } from "@uppy/xhr-upload/lib/index";

// Legacy Node-style TypeScript resolution misses Uppy 5's exports and falls back to hoisted
// Uppy 1 declarations. Resolve the pinned types explicitly until the legacy consumers migrate.
export const Uppy = UppyCore as unknown as typeof Uppy5;
type UploadOptions = XhrUploadOpts<Record<string, unknown>, UploadBody> & { id?: string };
export const XHRUpload = XHRUploadCore as unknown as {
    new (uppy: UploadUppy, options: UploadOptions): BasePlugin<UploadOptions, Record<string, unknown>, UploadBody>;
};
export const { UppyContextProvider, useDropzone, useFileInput } = UppyReact as unknown as typeof UppyReact5;

export type UploadBody = { value: unknown };
export type UploadUppy = Uppy5<Record<string, unknown>, UploadBody>;
export type UploadUppyFile = ReturnType<UploadUppy["getFiles"]>[number];
