import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import * as guiElements from "@eccenca/gui-elements";

assert.ok("Button" in guiElements, "The ESM root export must expose gui-elements components");
assert.ok("FileUpload" in guiElements, "The ESM root export must expose FileUpload");
const markup = renderToStaticMarkup(
    React.createElement(guiElements.FileUpload, {
        endpoint: "/upload",
        labels: {
            browse: "browse",
            completedFiles: (completed, total) => `${completed}/${total}`,
            dropHereOr: "Drop here or",
            fileUploadProgress: (file) => `Upload progress for ${file.name}`,
            overallUploadProgress: "Overall upload progress",
            uploadProgress: "Files",
        },
        name: "Package upload",
    }),
);
assert.match(markup, /role="group"/, "The ESM FileUpload export must render");
