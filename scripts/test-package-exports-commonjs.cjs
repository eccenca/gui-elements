const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

const guiElements = require("@eccenca/gui-elements");

assert.ok("Button" in guiElements, "The CommonJS root export must expose gui-elements components");
assert.ok("FileUpload" in guiElements, "The CommonJS root export must expose FileUpload");
const markup = renderToStaticMarkup(
    React.createElement(guiElements.FileUpload, {
        endpoint: "/upload",
        labels: {
            browse: "browse",
            cancelFile: "Cancel upload",
            continueUpload: "Continue uploads",
            retry: "Retry",
            stopUploads: "Stop uploads",
            uploadCancelled: "Upload cancelled",
            uploadedFile: (file) => `${file.name} uploaded`,
            selectedFile: (file) => `${file.name} selected`,
            removeFile: "Remove",
            removedFile: (file) => `${file.name} removed`,
            formatError: ({ kind, error }) => kind === "response" ? `Invalid response: ${error.message}` : `Upload failed: ${error.message}`,
            completedFiles: (completed, total) => `${completed}/${total}`,
            dropHereOr: "Drop here or",
            fileUploadProgress: (file) => `Upload progress for ${file.name}`,
            overallUploadProgress: "Overall upload progress",
            uploadProgress: "Files",
        },
        name: "Package upload",
    }),
);
assert.match(markup, /role="group"/, "The CommonJS FileUpload export must render");
