import React from "react";

import {
    FileUpload,
    FileUploadError,
    FileUploadHandle,
    FileUploadLabels,
    FileUploadProps,
} from "../../src/components/FileUpload";

declare const labels: FileUploadLabels;
const common = { name: "Upload", endpoint: "/upload", labels };
export const synchronousApproval = <FileUpload {...common} beforeUpload={(file) => file.name.endsWith(".ttl")} />;
export const asynchronousApproval = <FileUpload {...common} beforeUpload={async () => true} />;
// @ts-expect-error Approval cannot accidentally return a message instead of a boolean.
export const invalidApproval = <FileUpload {...common} beforeUpload={() => "approved"} />;
export const invalidRestriction: FileUploadError = {
    kind: "restriction",
    error: new Error(),
    // @ts-expect-error Size restrictions must include the configured limit.
    restriction: { code: "maxFileSize" },
};
export function restrictionLimit(error: FileUploadError) {
    if (error.kind === "restriction" && error.restriction.code === "maxFileSize") return error.restriction.maxFileSize;
    return undefined;
}
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
