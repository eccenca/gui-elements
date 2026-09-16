import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import "@testing-library/jest-dom";

import FileUpload from "./FileUpload";
import { FileUploadHandle } from "./types";

const labels = {
    browse: "browse files",
    completedFiles: (completed: number, total: number) => `${completed} of ${total} files completed`,
    dropHereOr: "Drop files here or",
    overallUploadProgress: "Overall upload progress",
    responseError: (error: Error) => `Invalid response: ${error.message}`,
    transportError: (error: Error) => `Upload failed: ${error.message}`,
    uploadProgress: "Upload progress",
    uploadedFile: (file: { name: string }) => `${file.name} uploaded`,
};

class ControlledXMLHttpRequest {
    static requests: ControlledXMLHttpRequest[] = [];

    method = "";
    url = "";
    requestBody: Document | XMLHttpRequestBodyInit | null = null;
    requestHeaders: Record<string, string> = {};
    response: unknown;
    responseText = "";
    responseType: XMLHttpRequestResponseType = "";
    status = 0;
    statusText = "";
    withCredentials = false;
    aborted = false;
    sent = false;
    onerror: (() => void | Promise<void>) | null = null;
    onload: (() => void | Promise<void>) | null = null;
    upload = { onprogress: null as ((event: ProgressEvent) => void) | null };

    constructor() {
        ControlledXMLHttpRequest.requests.push(this);
    }

    abort() {
        this.aborted = true;
    }

    open(method: string, url: string) {
        this.method = method;
        this.url = url;
    }

    send(body: Document | XMLHttpRequestBodyInit | null) {
        this.requestBody = body;
        this.sent = true;
    }

    setRequestHeader(name: string, value: string) {
        this.requestHeaders[name] = value;
    }

    progress(loaded: number, total: number) {
        this.upload.onprogress?.({ lengthComputable: true, loaded, total } as ProgressEvent);
    }

    async fail(message: string) {
        this.statusText = message;
        await this.onerror?.();
    }

    async respond(status: number, responseText: string) {
        this.status = status;
        this.responseText = responseText;
        await this.onload?.();
    }
}

class ControlledFormData {
    append() {}
}

const NativeXMLHttpRequest = global.XMLHttpRequest;
const NativeFormData = global.FormData;
const nativeAbortSignalAny = AbortSignal.any;

const combineAbortSignals = (signals: AbortSignal[]): AbortSignal => {
    const controller = new AbortController();
    signals.forEach((signal) => {
        if (signal.aborted) controller.abort();
        else signal.addEventListener("abort", () => controller.abort(), { once: true });
    });
    return controller.signal;
};

const completeRequest = async (request: ControlledXMLHttpRequest, status: number, responseText: string) => {
    await act(async () => {
        await request.respond(status, responseText);
        await new Promise((resolve) => setTimeout(resolve, 0));
    });
};

const failRequest = async (request: ControlledXMLHttpRequest, message: string) => {
    await act(async () => {
        await request.fail(message);
        await new Promise((resolve) => setTimeout(resolve, 0));
    });
};

beforeEach(() => {
    ControlledXMLHttpRequest.requests = [];
    global.XMLHttpRequest = ControlledXMLHttpRequest as unknown as typeof XMLHttpRequest;
    window.XMLHttpRequest = ControlledXMLHttpRequest as unknown as typeof XMLHttpRequest;
    global.FormData = ControlledFormData as unknown as typeof FormData;
    window.FormData = ControlledFormData as unknown as typeof FormData;
    AbortSignal.any = combineAbortSignals;
});

afterEach(() => {
    jest.restoreAllMocks();
    global.XMLHttpRequest = NativeXMLHttpRequest;
    window.XMLHttpRequest = NativeXMLHttpRequest;
    global.FormData = NativeFormData;
    window.FormData = NativeFormData;
    AbortSignal.any = nativeAbortSignalAny;
});

describe("FileUpload transport", () => {
    it("uses current request configuration and emits the documented successful lifecycle", async () => {
        const events: string[] = [];
        const endpoint = jest.fn((file) => `/files/${file.name}`);
        const headers = jest.fn(() => ({ Authorization: "current token" }));
        const onUploadProgress = jest.fn((value) => events.push(`progress:${value}`));
        const onUploadSuccess = jest.fn((response) => events.push(`success:${response.body}`));
        render(
            <FileUpload
                name="Project upload"
                endpoint={endpoint}
                acceptedFileTypes={[".ttl"]}
                headers={headers}
                labels={labels}
                method="PUT"
                parseResponse={({ responseText }) => responseText.toUpperCase()}
                onUploadStart={() => events.push("start")}
                onUploadProgress={onUploadProgress}
                onUploadSuccess={onUploadSuccess}
                onUploadEnd={() => events.push("end")}
            />,
        );

        fireEvent.change(document.querySelector("input[type=file]")!, {
            target: { files: [new File(["contents"], "vocabulary.ttl")] },
        });
        await waitFor(() => expect(ControlledXMLHttpRequest.requests[0]?.sent).toBe(true));
        const request = ControlledXMLHttpRequest.requests[0];

        expect(request.method.toUpperCase()).toBe("PUT");
        expect(request.url).toBe("/files/vocabulary.ttl");
        expect(request.requestHeaders).toEqual({ Authorization: "current token" });
        expect(endpoint).toHaveBeenCalledWith(expect.objectContaining({ name: "vocabulary.ttl" }));
        act(() => request.progress(4, 8));
        expect(screen.getByRole("progressbar", { name: "Upload progress" })).toHaveAttribute("aria-valuenow", "50");
        await completeRequest(request, 201, "upload-id");

        await waitFor(() => expect(onUploadSuccess).toHaveBeenCalled());
        expect(onUploadSuccess).toHaveBeenCalledWith(
            expect.objectContaining({
                body: "UPLOAD-ID",
                status: 201,
                file: expect.objectContaining({ name: "vocabulary.ttl" }),
            }),
        );
        await waitFor(() => expect(events.at(-1)).toBe("end"));
        expect(events).toEqual(["start", "progress:50", "success:UPLOAD-ID", "progress:100", "end"]);
        expect(screen.getByRole("status")).toHaveTextContent("vocabulary.ttl uploaded");
    });

    it("waits for the imperative upload call in manual mode and deduplicates concurrent calls", async () => {
        const uploadRef = React.createRef<FileUploadHandle>();
        render(
            <FileUpload ref={uploadRef} name="Manual upload" endpoint="/files" autoUpload={false} labels={labels} />,
        );
        fireEvent.change(document.querySelector("input[type=file]")!, {
            target: { files: [new File(["contents"], "manual.ttl")] },
        });
        expect(ControlledXMLHttpRequest.requests).toHaveLength(0);

        let firstUpload!: Promise<void>;
        let secondUpload!: Promise<void>;
        act(() => {
            firstUpload = uploadRef.current!.upload();
            secondUpload = uploadRef.current!.upload();
        });
        expect(secondUpload).toBe(firstUpload);
        await waitFor(() => expect(ControlledXMLHttpRequest.requests[0]?.sent).toBe(true));
        await completeRequest(ControlledXMLHttpRequest.requests[0], 200, "done");
        await firstUpload;
    });

    it("shows byte-aggregate progress and completion count only for multiple files", async () => {
        const onUploadEnd = jest.fn();
        render(
            <FileUpload
                name="Batch upload"
                endpoint="/files"
                labels={labels}
                maxNumberOfFiles={2}
                onUploadEnd={onUploadEnd}
            />,
        );
        fireEvent.change(document.querySelector("input[type=file]")!, {
            target: {
                files: [new File(["12345678"], "first.ttl"), new File(["12345678"], "second.ttl")],
            },
        });
        await waitFor(() => expect(ControlledXMLHttpRequest.requests).toHaveLength(2));

        act(() => ControlledXMLHttpRequest.requests[0].progress(4, 8));
        expect(screen.getByRole("progressbar", { name: "Overall upload progress" })).toHaveAttribute(
            "aria-valuenow",
            "25",
        );
        expect(screen.getByText("0 of 2 files completed")).toBeInTheDocument();

        await completeRequest(ControlledXMLHttpRequest.requests[0], 200, "first");
        await waitFor(() => expect(screen.getByText("1 of 2 files completed")).toBeInTheDocument());
        expect(onUploadEnd).not.toHaveBeenCalled();
        await completeRequest(ControlledXMLHttpRequest.requests[1], 200, "second");
        await waitFor(() => expect(onUploadEnd).toHaveBeenCalledTimes(1));
    });

    it("reports mixed batch results per file and ends the batch once", async () => {
        jest.spyOn(console, "error").mockImplementation(() => undefined);
        const onUploadSuccess = jest.fn();
        const onUploadError = jest.fn();
        const onUploadEnd = jest.fn();
        render(
            <FileUpload
                name="Mixed upload"
                endpoint="/files"
                labels={labels}
                maxNumberOfFiles={2}
                onUploadSuccess={onUploadSuccess}
                onUploadError={onUploadError}
                onUploadEnd={onUploadEnd}
            />,
        );
        fireEvent.change(document.querySelector("input[type=file]")!, {
            target: { files: [new File(["first"], "first.ttl"), new File(["second"], "second.ttl")] },
        });
        await waitFor(() => expect(ControlledXMLHttpRequest.requests).toHaveLength(2));

        await completeRequest(ControlledXMLHttpRequest.requests[0], 200, "first-id");
        expect(onUploadSuccess).toHaveBeenCalledTimes(1);
        expect(onUploadEnd).not.toHaveBeenCalled();
        for (let attempt = 1; attempt <= 4; attempt += 1) {
            await waitFor(() => expect(ControlledXMLHttpRequest.requests[attempt]?.sent).toBe(true));
            await failRequest(ControlledXMLHttpRequest.requests[attempt], "Connection lost");
        }

        await waitFor(() => expect(onUploadError).toHaveBeenCalledTimes(1));
        expect(onUploadError).toHaveBeenCalledWith(
            expect.objectContaining({ kind: "transport", file: expect.objectContaining({ name: "second.ttl" }) }),
        );
        expect(onUploadEnd).toHaveBeenCalledTimes(1);
    });

    it("classifies parser failures as response errors with the HTTP status", async () => {
        jest.spyOn(console, "error").mockImplementation(() => undefined);
        const onUploadError = jest.fn();
        const onUploadEnd = jest.fn();
        render(
            <FileUpload<number>
                name="Parsed upload"
                endpoint="/files"
                labels={labels}
                parseResponse={() => {
                    throw new Error("Expected a numeric identifier");
                }}
                onUploadError={onUploadError}
                onUploadEnd={onUploadEnd}
            />,
        );
        fireEvent.change(document.querySelector("input[type=file]")!, {
            target: { files: [new File(["contents"], "invalid-response.ttl")] },
        });
        await waitFor(() => expect(ControlledXMLHttpRequest.requests[0]?.sent).toBe(true));
        await completeRequest(ControlledXMLHttpRequest.requests[0], 200, "not-a-number");

        await waitFor(() =>
            expect(onUploadError).toHaveBeenCalledWith(
                expect.objectContaining({
                    kind: "response",
                    status: 200,
                    file: expect.objectContaining({ name: "invalid-response.ttl" }),
                }),
            ),
        );
        expect(screen.getByRole("alert")).toHaveTextContent("Invalid response: Expected a numeric identifier");
        await waitFor(() => expect(onUploadEnd).toHaveBeenCalledTimes(1));
    });

    it("classifies an exhausted request as a transport error and ends the batch once", async () => {
        jest.spyOn(console, "error").mockImplementation(() => undefined);
        const onUploadError = jest.fn();
        const onUploadEnd = jest.fn();
        render(
            <FileUpload
                name="Failing upload"
                endpoint="/files"
                labels={labels}
                onUploadError={onUploadError}
                onUploadEnd={onUploadEnd}
            />,
        );
        fireEvent.change(document.querySelector("input[type=file]")!, {
            target: { files: [new File(["contents"], "network-error.ttl")] },
        });

        for (let attempt = 0; attempt < 4; attempt += 1) {
            await waitFor(() => expect(ControlledXMLHttpRequest.requests[attempt]?.sent).toBe(true));
            await failRequest(ControlledXMLHttpRequest.requests[attempt], "Connection lost");
        }

        await waitFor(() =>
            expect(onUploadError).toHaveBeenCalledWith(
                expect.objectContaining({
                    kind: "transport",
                    file: expect.objectContaining({ name: "network-error.ttl" }),
                }),
            ),
        );
        expect(screen.getByRole("alert")).toHaveTextContent("Upload failed:");
        await waitFor(() => expect(onUploadEnd).toHaveBeenCalledTimes(1));
    });

    it("aborts an active request and ends the batch once without reporting an error", async () => {
        const uploadRef = React.createRef<FileUploadHandle>();
        const onUploadError = jest.fn();
        const onUploadEnd = jest.fn();
        render(
            <FileUpload
                ref={uploadRef}
                name="Cancelable upload"
                endpoint="/files"
                labels={labels}
                onUploadError={onUploadError}
                onUploadEnd={onUploadEnd}
            />,
        );
        fireEvent.change(document.querySelector("input[type=file]")!, {
            target: { files: [new File(["contents"], "cancel.ttl")] },
        });
        await waitFor(() => expect(ControlledXMLHttpRequest.requests[0]?.sent).toBe(true));
        expect(screen.getByRole("group", { name: "Cancelable upload" })).toHaveAttribute("aria-busy", "true");

        act(() => {
            uploadRef.current!.cancel();
            uploadRef.current!.cancel();
        });

        expect(ControlledXMLHttpRequest.requests[0].aborted).toBe(true);
        expect(onUploadError).not.toHaveBeenCalled();
        expect(onUploadEnd).toHaveBeenCalledTimes(1);
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        expect(screen.getByRole("group", { name: "Cancelable upload" })).not.toHaveAttribute("aria-busy");
    });

    it("resets an active upload idempotently and accepts a fresh selection", async () => {
        const uploadRef = React.createRef<FileUploadHandle>();
        const onUploadEnd = jest.fn();
        render(
            <FileUpload
                ref={uploadRef}
                name="Resettable upload"
                endpoint="/files"
                labels={labels}
                onUploadEnd={onUploadEnd}
            />,
        );
        fireEvent.change(document.querySelector("input[type=file]")!, {
            target: { files: [new File(["first"], "first.ttl")] },
        });
        await waitFor(() => expect(ControlledXMLHttpRequest.requests[0]?.sent).toBe(true));
        act(() => ControlledXMLHttpRequest.requests[0].progress(1, 5));

        act(() => {
            uploadRef.current!.reset();
            uploadRef.current!.reset();
        });

        expect(ControlledXMLHttpRequest.requests[0].aborted).toBe(true);
        expect(onUploadEnd).toHaveBeenCalledTimes(1);
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();

        fireEvent.change(document.querySelector("input[type=file]")!, {
            target: { files: [new File(["second"], "second.ttl")] },
        });
        await waitFor(() => expect(ControlledXMLHttpRequest.requests[1]?.sent).toBe(true));
    });

    it("aborts on unmount without firing late consumer callbacks", async () => {
        const onUploadEnd = jest.fn();
        const onUploadSuccess = jest.fn();
        const { unmount } = render(
            <FileUpload
                name="Unmounted upload"
                endpoint="/files"
                labels={labels}
                onUploadEnd={onUploadEnd}
                onUploadSuccess={onUploadSuccess}
            />,
        );
        fireEvent.change(document.querySelector("input[type=file]")!, {
            target: { files: [new File(["contents"], "unmount.ttl")] },
        });
        await waitFor(() => expect(ControlledXMLHttpRequest.requests[0]?.sent).toBe(true));

        unmount();

        expect(ControlledXMLHttpRequest.requests[0].aborted).toBe(true);
        expect(onUploadSuccess).not.toHaveBeenCalled();
        expect(onUploadEnd).not.toHaveBeenCalled();
    });
});
