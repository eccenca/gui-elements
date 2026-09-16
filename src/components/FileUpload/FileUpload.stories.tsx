import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { FileUpload, FileUploadProps } from "../../index";

const defaultArgs: FileUploadProps = {
    name: "Upload graph file",
    endpoint: "/files",
    acceptedFileTypes: [".ttl", ".nt", ".rdf"],
    maxFileSize: 10_000_000,
    labels: {
        dropHereOr: "Drop a graph file here or",
        browse: "browse files",
        uploadProgress: "Upload progress",
        overallUploadProgress: "Overall upload progress",
        completedFiles: (completed, total) => `${completed} of ${total} files completed`,
        selectedFile: (file) => `Selected ${file.name}`,
    },
    instructions: "Turtle, N-Triples or RDF/XML; maximum 10 MB. Press Enter or Space to browse.",
};

export default {
    title: "Forms/FileUpload",
    component: FileUpload,
    args: defaultArgs,
} as Meta<typeof FileUpload>;

const Template: StoryFn<typeof FileUpload> = (args) => <FileUpload {...args} />;

export const Idle = Template.bind({});

const DraggingTemplate: StoryFn<typeof FileUpload> = (args) => {
    const storyRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        storyRef.current
            ?.querySelector('[data-dropzone-for="Files"]')
            ?.dispatchEvent(new Event("dragenter", { bubbles: true, cancelable: true }));
    }, []);

    return (
        <div ref={storyRef}>
            <FileUpload {...args} />
        </div>
    );
};

export const Dragging = DraggingTemplate.bind({});

export const Disabled = Template.bind({});
Disabled.args = {
    disabled: true,
};

export const MultipleFiles = Template.bind({});
MultipleFiles.args = {
    maxNumberOfFiles: 3,
};
