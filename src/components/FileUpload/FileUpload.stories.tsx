import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { waitFor, within } from "storybook/test";

import { FileUpload, FileUploadFile, FileUploadProps } from "../../index";

const defaultArgs: FileUploadProps = {
    name: "Upload graph file",
    endpoint: "/files",
    acceptedFileTypes: [".ttl", ".nt", ".rdf"],
    maxFileSize: 10_000_000,
    labels: {
        dropHereOr: "Drop a graph file here or",
        browse: "browse files",
        uploadProgress: "Files",
        overallUploadProgress: "Overall upload progress",
        completedFiles: (completed, total) => `${completed} of ${total} files completed`,
        fileUploadProgress: (file) => `Upload progress for ${file.name}`,
        selectedFile: (file) => `Selected ${file.name}`,
        uploadedFile: (file) => `${file.name} uploaded`,
        restrictionError: (_error, file) => `${file?.name ?? "File"} cannot be uploaded`,
        responseError: (error, file) => `${file?.name ?? "File"} returned an invalid response: ${error.message}`,
        transportError: (error, file) => `${file?.name ?? "File"} could not be uploaded: ${error.message}`,
    },
    instructions: "Turtle, N-Triples or RDF/XML; maximum 10 MB. Press Enter or Space to browse.",
};

export default {
    title: "Forms/FileUpload",
    component: FileUpload,
    args: defaultArgs,
    parameters: {
        a11y: { test: "error" },
    },
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

type RequestOutcome = "uploading" | "complete" | "error";

interface StoryUploadState {
    progress: number;
    outcome: RequestOutcome;
}

const storyFile = (name: string) => new File([name.repeat(32)], name, { type: "text/turtle" });

const createStoryXMLHttpRequest = (stateForFile: (fileName: string) => StoryUploadState) =>
    class StoryXMLHttpRequest {
        response: unknown;
        responseText = "";
        responseType: XMLHttpRequestResponseType = "";
        status = 0;
        statusText = "";
        withCredentials = false;
        onerror: (() => void) | null = null;
        onload: (() => void) | null = null;
        upload = { onprogress: null as ((event: ProgressEvent) => void) | null };

        private url = "";
        private timers: number[] = [];

        abort() {
            this.timers.forEach((timer) => window.clearTimeout(timer));
            this.timers = [];
        }

        open(_method: string, url: string) {
            this.url = url;
        }

        send() {
            const fileName = decodeURIComponent(this.url.split("/").pop() ?? "");
            const state = stateForFile(fileName);
            this.schedule(() => {
                this.upload.onprogress?.({
                    lengthComputable: true,
                    loaded: state.progress,
                    total: 100,
                } as ProgressEvent);
            }, 50);
            if (state.outcome === "complete") {
                this.schedule(() => {
                    this.status = 200;
                    this.responseText = `${fileName}-upload-id`;
                    this.onload?.();
                }, 100);
            } else if (state.outcome === "error") {
                this.schedule(() => {
                    this.status = 400;
                    this.statusText = "Upload rejected";
                    this.onload?.();
                }, 100);
            }
        }

        setRequestHeader() {}

        private schedule(callback: () => void, delay: number) {
            this.timers.push(window.setTimeout(callback, delay));
        }
    };

interface UploadStateStoryProps {
    args: FileUploadProps;
    files: File[];
    stateForFile: (fileName: string) => StoryUploadState;
}

const UploadStateStory = ({ args, files, stateForFile }: UploadStateStoryProps) => {
    const [transportReady, setTransportReady] = React.useState(false);
    const storyRef = React.useRef<HTMLDivElement>(null);
    const selected = React.useRef(false);

    React.useEffect(() => {
        const nativeXMLHttpRequest = window.XMLHttpRequest;
        window.XMLHttpRequest = createStoryXMLHttpRequest(stateForFile) as unknown as typeof XMLHttpRequest;
        setTransportReady(true);
        return () => {
            window.XMLHttpRequest = nativeXMLHttpRequest;
        };
    }, [stateForFile]);

    React.useEffect(() => {
        if (!transportReady || selected.current) return;
        const input = storyRef.current?.querySelector("input[type=file]");
        if (!(input instanceof HTMLInputElement)) return;
        selected.current = true;
        Object.defineProperty(input, "files", { configurable: true, value: files });
        input.dispatchEvent(new Event("change", { bubbles: true }));
    }, [files, transportReady]);

    return (
        <div ref={storyRef}>
            {transportReady && (
                <FileUpload
                    {...args}
                    endpoint={(file: FileUploadFile) => `/storybook-upload/${encodeURIComponent(file.name)}`}
                    maxNumberOfFiles={Math.max(args.maxNumberOfFiles ?? 1, files.length)}
                />
            )}
        </div>
    );
};

const uploadingState = () => ({ outcome: "uploading", progress: 45 }) as const;
const completedState = () => ({ outcome: "complete", progress: 100 }) as const;
const errorState = () => ({ outcome: "error", progress: 25 }) as const;

const waitForProgress = async (canvasElement: HTMLElement, name: string, value: string) => {
    await waitFor(
        () => {
            const progressbar = within(canvasElement).getByRole("progressbar", { name });
            if (progressbar.getAttribute("aria-valuenow") !== value) {
                throw new Error(`Expected ${name} to reach ${value}%`);
            }
        },
        { timeout: 3_000 },
    );
};

const waitForAlert = async (canvasElement: HTMLElement) => {
    await waitFor(() => within(canvasElement).getByRole("alert"), { timeout: 3_000 });
};

export const Uploading: StoryFn<typeof FileUpload> = (args) => (
    <UploadStateStory args={args} files={[storyFile("graph.ttl")]} stateForFile={uploadingState} />
);
Uploading.play = ({ canvasElement }) => waitForProgress(canvasElement, "Upload progress for graph.ttl", "45");

export const Completed: StoryFn<typeof FileUpload> = (args) => (
    <UploadStateStory args={args} files={[storyFile("graph.ttl")]} stateForFile={completedState} />
);
Completed.play = ({ canvasElement }) => waitForProgress(canvasElement, "Upload progress for graph.ttl", "100");

const multipleFiles = [storyFile("first.ttl"), storyFile("second.ttl"), storyFile("third.ttl")];
const multipleUploadingState = (fileName: string): StoryUploadState => {
    if (fileName === "first.ttl") return { outcome: "complete", progress: 100 };
    if (fileName === "second.ttl") return { outcome: "uploading", progress: 65 };
    return { outcome: "uploading", progress: 20 };
};

export const MultipleFilesUploading: StoryFn<typeof FileUpload> = (args) => (
    <UploadStateStory args={args} files={multipleFiles} stateForFile={multipleUploadingState} />
);
MultipleFilesUploading.args = { concurrency: 3 };
MultipleFilesUploading.play = ({ canvasElement }) =>
    waitForProgress(canvasElement, "Upload progress for second.ttl", "65");

const mixedResultState = (fileName: string): StoryUploadState => {
    if (fileName === "first.ttl") return { outcome: "complete", progress: 100 };
    if (fileName === "second.ttl") return { outcome: "uploading", progress: 65 };
    return { outcome: "error", progress: 30 };
};

export const MixedResults: StoryFn<typeof FileUpload> = (args) => (
    <UploadStateStory args={args} files={multipleFiles} stateForFile={mixedResultState} />
);
MixedResults.args = { concurrency: 3 };
MixedResults.play = async ({ canvasElement }) => {
    await waitFor(
        () => {
            const failedProgress = within(canvasElement).getByRole("progressbar", {
                name: "Upload progress for third.ttl",
            });
            if (failedProgress.closest("[role=listitem]")?.getAttribute("data-state") !== "error") {
                throw new Error("Expected third.ttl to reach the error state");
            }
        },
        { timeout: 3_000 },
    );
};

export const TransportError: StoryFn<typeof FileUpload> = (args) => (
    <UploadStateStory args={args} files={[storyFile("rejected.ttl")]} stateForFile={errorState} />
);
TransportError.play = ({ canvasElement }) => waitForAlert(canvasElement);

export const RestrictionError: StoryFn<typeof FileUpload> = (args) => (
    <UploadStateStory args={args} files={[storyFile("unsupported.txt")]} stateForFile={uploadingState} />
);
RestrictionError.play = ({ canvasElement }) => waitForAlert(canvasElement);
