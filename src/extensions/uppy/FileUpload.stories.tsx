import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { FileUpload } from "./FileUpload";

export default {
    title: "Extensions/FileUpload",
    component: FileUpload,
} as Meta<typeof FileUpload>;

const TemplateFull: StoryFn<typeof FileUpload> = (args) => <FileUpload {...args} />;

export const BasicExample = TemplateFull.bind({});
BasicExample.args = {
    id: "fileupload",
    onError: null,
    onSuccess: null,
    handleResponseData: null,
    localeOptions: {
        strings: {
            dropHereOr: "Drop here or %{browse}",
            browse: "browse",
        },
    },
    resetForm: true,
    autoProceed: true,
    restrictions: {
        maxFileSize: 1000000,
        minNumberOfFiles: 1,
        maxNumberOfFiles: 5,
        allowedFileTypes: [".jpg", ".png"],
    },
};