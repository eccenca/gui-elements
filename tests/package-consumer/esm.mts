import { Button, FileUpload } from "@eccenca/gui-elements";

export const button: typeof Button = Button;
export const upload: typeof FileUpload = FileUpload;

// @ts-expect-error ESM imports must retain the declared component types.
export const invalidUpload: typeof FileUpload = 42;
