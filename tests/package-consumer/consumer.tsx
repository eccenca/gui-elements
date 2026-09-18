import { Button, FileUpload, type FileUploadLabels, type FileUploadProps } from "@eccenca/gui-elements";

declare const labels: FileUploadLabels;
const uploadProps = { name: "Upload", endpoint: "/upload", labels };

export const button = <Button onClick={(event) => event.preventDefault()}>Upload</Button>;
export const textUpload = (
    <FileUpload
        {...uploadProps}
        beforeUpload={(file) => file.name.endsWith(".ttl")}
        onUploadSuccess={({ body }) => {
            body.toUpperCase();
            // @ts-expect-error The default response body is a string, not any.
            body.missingProperty;
        }}
    />
);
export const parsedUpload = (
    <FileUpload
        {...uploadProps}
        parseResponse={() => ({ id: 42 })}
        onUploadSuccess={({ body }) => {
            body.id.toFixed();
            // @ts-expect-error The parser determines the response body's type.
            body.toUpperCase();
        }}
    />
);

// @ts-expect-error Approval must return a boolean, not a message.
export const invalidApproval = <FileUpload {...uploadProps} beforeUpload={() => "approved"} />;
// @ts-expect-error Structured response props require a parser.
export const invalidProps: FileUploadProps<{ id: number }> = uploadProps;
