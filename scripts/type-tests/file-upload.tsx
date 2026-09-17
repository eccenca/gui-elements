import React from "react";

import { FileUpload, FileUploadHandle, FileUploadLabels, FileUploadProps } from "../../src/components/FileUpload";

declare const labels: FileUploadLabels;
const common = { name: "Upload", endpoint: "/upload", labels };
const textRef = React.createRef<FileUploadHandle<string>>();
const parsedRef = React.createRef<FileUploadHandle<{ id: number } | null>>();

export const textUpload = <FileUpload {...common} ref={textRef} onUploadSuccess={({ body }) => body.toUpperCase()} />;
export const parsedUpload = (
    <FileUpload
        {...common}
        ref={parsedRef}
        parseResponse={({ status }) => (status === 204 ? null : { id: 42 })}
        onUploadSuccess={({ body }) => body?.id.toFixed()}
    />
);
export const undefinedUpload = (
    <FileUpload
        {...common}
        parseResponse={() => undefined}
        onUploadSuccess={({ body }) => {
            const value: undefined = body;
            return value;
        }}
    />
);
export const literalUpload = (
    <FileUpload
        {...common}
        parseResponse={() => "ok" as const}
        onUploadSuccess={({ body }) => {
            const value: "ok" = body;
            return value;
        }}
    />
);

// @ts-expect-error A narrower string response requires a parser.
export const invalidLiteral = <FileUpload<"ok"> {...common} />;
// @ts-expect-error Generic response props must require a parser too.
export const invalidProps: FileUploadProps<"ok"> = common;
// @ts-expect-error Parser-free responses cannot use a structured-response ref.
export const invalidRef = <FileUpload {...common} ref={parsedRef} />;
export const invalidCallback = (
    // @ts-expect-error The parser determines the success body's type.
    <FileUpload {...common} parseResponse={() => 42} onUploadSuccess={({ body }) => body.toUpperCase()} />
);

export async function completionTypes() {
    const result = await parsedRef.current?.upload();
    return result?.successful.map(({ body }) => body?.id.toFixed());
}
