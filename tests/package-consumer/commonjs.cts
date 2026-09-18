import guiElements = require("@eccenca/gui-elements");

export const button: typeof guiElements.Button = guiElements.Button;
export const upload: typeof guiElements.FileUpload = guiElements.FileUpload;

// @ts-expect-error CommonJS imports must retain the declared component types.
export const invalidUpload: typeof guiElements.FileUpload = 42;
