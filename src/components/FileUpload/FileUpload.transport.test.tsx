import React from "react";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import "@testing-library/jest-dom";

import FileUpload from "./FileUpload";
import { completeRequest, ControlledXMLHttpRequest, failRequest, labels } from "./testHelpers";
import { FileUploadHandle, FileUploadResult } from "./types";

const select = (...files: File[]) =>
    fireEvent.change(document.querySelector("input[type=file]")!, { target: { files } });
const file = (name: string, contents = "data") => new File([contents], name);
const request = async (index: number) => {
    await waitFor(() => expect(ControlledXMLHttpRequest.requests[index]?.sent).toBe(true));
    return ControlledXMLHttpRequest.requests[index];
};
const row = (name: string) =>
    screen.getByRole("progressbar", { name: `Upload progress for ${name}` }).closest('[role="listitem"]')!;
const deferred = <T,>() => {
    let resolve!: (value: T) => void;
    let reject!: (error: Error) => void;
    const promise = new Promise<T>((yes, no) => {
        resolve = yes;
        reject = no;
    });
    return { promise, resolve, reject };
};

describe("FileUpload transport", () => {
    it.each([
        [{ maxFileSize: 2 }, [file("large.ttl")], { code: "maxFileSize", maxFileSize: 2 }],
        [{ acceptedFileTypes: [".ttl"] }, [file("wrong.txt")], { code: "fileType", acceptedFileTypes: [".ttl"] }],
        [
            { maxNumberOfFiles: 1 },
            [file("one.ttl"), file("two.ttl")],
            { code: "maxNumberOfFiles", maxNumberOfFiles: 1 },
        ],
    ])("reports structured selection restrictions: %j", async (restrictions, files, detail) => {
        const onUploadError = jest.fn(),
            beforeUpload = jest.fn(() => true);
        render(
            <FileUpload
                name="Restrictions"
                endpoint="/files"
                labels={labels}
                {...restrictions}
                beforeUpload={beforeUpload}
                onUploadError={onUploadError}
            />,
        );
        select(...files);
        expect(onUploadError).toHaveBeenCalledWith(
            expect.objectContaining({ kind: "restriction", restriction: detail }),
        );
        expect(beforeUpload).not.toHaveBeenCalled();
        expect(ControlledXMLHttpRequest.requests).toHaveLength(0);
    });

    it("reports duplicates and retained-selection limits without inspecting error text", async () => {
        const onUploadError = jest.fn();
        render(
            <FileUpload
                name="Retained restrictions"
                endpoint="/files"
                labels={labels}
                maxNumberOfFiles={2}
                autoUpload={false}
                onUploadError={onUploadError}
            />,
        );
        const duplicate = file("one.ttl");
        select(duplicate);
        select(duplicate);
        expect(onUploadError).toHaveBeenLastCalledWith(
            expect.objectContaining({
                restriction: { code: "duplicate" },
                file: expect.objectContaining({ name: "one.ttl" }),
            }),
        );
        select(file("two.ttl"), file("three.ttl"));
        expect(onUploadError).toHaveBeenLastCalledWith(
            expect.objectContaining({
                restriction: { code: "maxNumberOfFiles", maxNumberOfFiles: 2 },
            }),
        );
        expect(ControlledXMLHttpRequest.requests).toHaveLength(0);
    });

    it("prioritizes size details when initial files violate both size and type", () => {
        const onUploadError = jest.fn();
        const formatError = jest.fn(() => "Localized restriction");
        render(
            <FileUpload
                name="Initial restrictions"
                endpoint="/files"
                labels={{ ...labels, formatError }}
                initialFiles={[file("large.txt")]}
                maxFileSize={2}
                acceptedFileTypes={[".ttl"]}
                onUploadError={onUploadError}
            />,
        );
        expect(onUploadError).toHaveBeenCalledWith(
            expect.objectContaining({
                kind: "restriction",
                restriction: { code: "maxFileSize", maxFileSize: 2 },
            }),
        );
        expect(formatError).toHaveBeenCalledWith(onUploadError.mock.calls[0][0]);
        expect(screen.getByRole("alert")).toHaveTextContent("Localized restriction");
        expect(ControlledXMLHttpRequest.requests).toHaveLength(0);
    });

    it("reports updated restrictions when a queued file is started manually", async () => {
        const ref = React.createRef<FileUploadHandle>();
        const props = { name: "Updated restrictions", endpoint: "/files", labels, autoUpload: false };
        const { rerender } = render(<FileUpload {...props} ref={ref} />);
        select(file("large.ttl"));
        await waitFor(() => expect(row("large.ttl")).toHaveAttribute("data-state", "queued"));
        rerender(<FileUpload {...props} ref={ref} maxFileSize={2} />);
        await act(async () => {
            const result = await ref.current!.upload();
            expect(result.failed).toEqual([
                expect.objectContaining({
                    kind: "restriction",
                    restriction: { code: "maxFileSize", maxFileSize: 2 },
                }),
            ]);
        });
        expect(ControlledXMLHttpRequest.requests).toHaveLength(0);
    });

    it("runs synchronous approval at selection time in manual mode and catches synchronous throws", async () => {
        const beforeUpload = jest.fn((selected) => {
            if (selected.name === "broken.ttl") throw new Error("Check failed");
            return selected.name !== "declined.ttl";
        });
        const onUploadError = jest.fn();
        render(
            <FileUpload
                name="Synchronous approval"
                endpoint="/files"
                labels={labels}
                maxNumberOfFiles={null}
                autoUpload={false}
                beforeUpload={beforeUpload}
                onUploadError={onUploadError}
            />,
        );
        select(file("accepted.ttl"), file("declined.ttl"), file("broken.ttl"));
        await waitFor(() => expect(beforeUpload).toHaveBeenCalledTimes(3));
        await waitFor(() =>
            expect(onUploadError).toHaveBeenCalledWith(expect.objectContaining({ kind: "validation" })),
        );
        expect(screen.queryByText("declined.ttl")).not.toBeInTheDocument();
        expect(row("accepted.ttl")).toHaveAttribute("data-state", "queued");
        expect(ControlledXMLHttpRequest.requests).toHaveLength(0);
    });
    it("uses short Remove labels and focuses the next or previous Remove after committing removal", async () => {
        render(<FileUpload name="Removal focus" endpoint="/files" labels={labels} maxNumberOfFiles={null} />);
        select(file("first.ttl"), file("second.ttl"), file("third.ttl"));
        await request(0);
        fireEvent.click(screen.getByRole("button", { name: "Stop uploads" }));
        const remove = (name: string) => screen.getByRole("button", { name: "Remove", description: name });
        expect(remove("first.ttl")).toHaveTextContent(/^Remove$/);
        fireEvent.click(remove("second.ttl"));
        expect(remove("third.ttl")).toHaveFocus();
        expect(screen.queryByText("second.ttl")).not.toBeInTheDocument();
        fireEvent.click(remove("third.ttl"));
        expect(remove("first.ttl")).toHaveFocus();
        fireEvent.click(remove("first.ttl"));
        expect(screen.getByRole("button", { name: /browse files/ })).toHaveFocus();
    });
    it("preserves both successes when another selection joins an active upload", async () => {
        const onUploadSuccess = jest.fn();
        render(
            <FileUpload
                name="Joining upload"
                endpoint="/files"
                labels={labels}
                maxNumberOfFiles={null}
                onUploadSuccess={onUploadSuccess}
            />,
        );
        const input = document.querySelector("input[type=file]")!;
        fireEvent.change(input, { target: { files: [new File(["one"], "one.ttl")] } });
        await waitFor(() => expect(ControlledXMLHttpRequest.requests[0]?.sent).toBe(true));
        fireEvent.change(input, { target: { files: [new File(["two"], "two.ttl")] } });
        await waitFor(() =>
            expect(screen.getByRole("progressbar", { name: "Upload progress for two.ttl" })).toBeInTheDocument(),
        );
        await completeRequest(ControlledXMLHttpRequest.requests[0], 200, "one");
        await waitFor(() => expect(ControlledXMLHttpRequest.requests[1]?.sent).toBe(true));
        await completeRequest(ControlledXMLHttpRequest.requests[1], 200, "two");
        await waitFor(() => expect(onUploadSuccess).toHaveBeenCalledTimes(2));
        expect(screen.getByText("2 of 2 files completed")).toBeInTheDocument();
    });

    it("counts cancelled files until removal before continuing the remaining uploads", async () => {
        render(
            <FileUpload name="Retained cancelled files" endpoint="/files" labels={labels} maxNumberOfFiles={null} />,
        );
        fireEvent.change(document.querySelector("input[type=file]")!, {
            target: {
                files: [new File(["aaa"], "a.ttl"), new File(["bbb"], "b.ttl"), new File(["ccc"], "c.ttl")],
            },
        });
        await waitFor(() => expect(ControlledXMLHttpRequest.requests[0]?.sent).toBe(true));
        await completeRequest(ControlledXMLHttpRequest.requests[0], 200, "a");
        await waitFor(() => expect(ControlledXMLHttpRequest.requests[1]?.sent).toBe(true));
        fireEvent.click(screen.getByRole("button", { name: "Stop uploads" }));
        expect(screen.getByRole("progressbar", { name: "Overall upload progress" })).toHaveAttribute(
            "aria-valuenow",
            "33",
        );
        fireEvent.click(screen.getByRole("button", { name: "Remove", description: "b.ttl" }));
        expect(screen.getByRole("progressbar", { name: "Overall upload progress" })).toHaveAttribute(
            "aria-valuenow",
            "50",
        );
        fireEvent.click(screen.getByRole("button", { name: "Continue uploads" }));
        await waitFor(() => expect(ControlledXMLHttpRequest.requests[2]?.sent).toBe(true));
        await completeRequest(ControlledXMLHttpRequest.requests[2], 200, "c");
        expect(screen.getByText("2 of 2 files completed")).toBeInTheDocument();
        expect(ControlledXMLHttpRequest.requests.filter((request) => request.sent)).toHaveLength(3);
    });

    it("preserves a nullable parser result instead of replacing it with response text", async () => {
        const onUploadSuccess = jest.fn();
        render(
            <FileUpload
                name="Nullable response"
                endpoint="/files"
                labels={labels}
                parseResponse={() => null}
                onUploadSuccess={onUploadSuccess}
            />,
        );
        fireEvent.change(document.querySelector("input[type=file]")!, {
            target: { files: [new File(["a"], "a.ttl")] },
        });
        await waitFor(() => expect(ControlledXMLHttpRequest.requests[0]?.sent).toBe(true));
        await completeRequest(ControlledXMLHttpRequest.requests[0], 200, "ignored");
        expect(onUploadSuccess).toHaveBeenCalledWith(expect.objectContaining({ body: null }));
    });

    it("returns one typed result for overlapping manual calls and publishes state before completion", async () => {
        const ref = React.createRef<FileUploadHandle<{ id: string }>>();
        const state = jest.fn();
        const onComplete = jest.fn(() =>
            expect(state).toHaveBeenLastCalledWith(expect.objectContaining({ allSuccessful: true })),
        );
        render(
            <FileUpload
                ref={ref}
                name="Manual"
                endpoint="/files"
                labels={labels}
                autoUpload={false}
                parseResponse={({ responseText }) => ({ id: responseText })}
                onStateChange={state}
                onComplete={onComplete}
            />,
        );
        select(file("manual.ttl"));
        expect(ControlledXMLHttpRequest.requests).toHaveLength(0);
        let first!: Promise<FileUploadResult<{ id: string }>>;
        act(() => {
            first = ref.current!.upload();
            expect(ref.current!.upload()).toBe(first);
        });
        await completeRequest(await request(0), 201, "upload-id");
        expect(await first).toEqual(
            expect.objectContaining({
                reason: "settled",
                successful: [expect.objectContaining({ body: { id: "upload-id" }, status: 201 })],
            }),
        );
        expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it("lets approved files upload while another approval waits and completes only after all decisions", async () => {
        const approval = deferred<boolean>();
        const onComplete = jest.fn();
        render(
            <FileUpload
                name="Approval"
                endpoint={(f) => "/files/" + f.name}
                labels={labels}
                maxNumberOfFiles={null}
                beforeUpload={(f) => (f.name === "existing.ttl" ? approval.promise : Promise.resolve(true))}
                onComplete={onComplete}
            />,
        );
        select(file("existing.ttl"), file("new.ttl"));
        const first = await request(0);
        expect(first.url).toBe("/files/new.ttl");
        await completeRequest(first, 200, "new");
        expect(onComplete).not.toHaveBeenCalled();
        await act(async () => approval.resolve(true));
        const second = await request(1);
        expect(second.url).toBe("/files/existing.ttl");
        expect(screen.getByText("1 of 2 files completed")).toBeInTheDocument();
        await completeRequest(second, 200, "existing");
        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(onComplete).toHaveBeenLastCalledWith(
            expect.objectContaining({
                successful: expect.arrayContaining([
                    expect.objectContaining({ file: expect.objectContaining({ name: "new.ttl" }) }),
                    expect.objectContaining({ file: expect.objectContaining({ name: "existing.ttl" }) }),
                ]),
            }),
        );
    });

    it("declines without a request and retries a rejected approval", async () => {
        const beforeUpload = jest
            .fn()
            .mockRejectedValueOnce(new Error("Check unavailable"))
            .mockResolvedValueOnce(true);
        const onUploadError = jest.fn();
        const { rerender } = render(
            <FileUpload
                name="Check"
                endpoint="/files"
                labels={labels}
                beforeUpload={beforeUpload}
                onUploadError={onUploadError}
            />,
        );
        select(file("checked.ttl"));
        await screen.findByRole("alert");
        expect(onUploadError).toHaveBeenCalledWith(expect.objectContaining({ kind: "validation" }));
        expect(ControlledXMLHttpRequest.requests).toHaveLength(0);
        fireEvent.click(screen.getByRole("button", { name: "Retry" }));
        await completeRequest(await request(0), 200, "done");
        expect(beforeUpload).toHaveBeenCalledTimes(2);
        rerender(<FileUpload name="Check" endpoint="/files" labels={labels} beforeUpload={async () => false} />);
        select(file("declined.ttl"));
        await waitFor(() => expect(screen.queryByText("declined.ttl")).not.toBeInTheDocument());
        expect(ControlledXMLHttpRequest.requests).toHaveLength(1);
    });

    it.each(["cancel", "reset", "remove", "unmount"] as const)("ignores pending approval after %s", async (action) => {
        const approval = deferred<boolean>();
        const beforeUpload = jest.fn(() => approval.promise);
        const ref = React.createRef<FileUploadHandle>();
        const onFilesAdded = jest.fn();
        const onUploadSuccess = jest.fn();
        const { unmount } = render(
            <FileUpload
                ref={ref}
                name="Pending"
                endpoint="/files"
                labels={labels}
                beforeUpload={beforeUpload}
                onFilesAdded={onFilesAdded}
                onUploadSuccess={onUploadSuccess}
            />,
        );
        select(file("pending.ttl"));
        await waitFor(() => expect(beforeUpload).toHaveBeenCalled());
        act(() => {
            if (action === "unmount") unmount();
            else if (action === "remove") ref.current!.remove(onFilesAdded.mock.calls[0][0][0].id);
            else ref.current![action]();
        });
        await act(async () => approval.resolve(true));
        expect(beforeUpload.mock.calls[0][1].aborted).toBe(true);
        expect(ControlledXMLHttpRequest.requests).toHaveLength(0);
        expect(onUploadSuccess).not.toHaveBeenCalled();
    });

    it("retains completed history and announcements while accepting the next single file", async () => {
        render(<FileUpload name="Next selection" endpoint="/files" labels={labels} />);
        select(file("first.ttl"));
        await completeRequest(await request(0), 200, "first");
        expect(screen.getByRole("status")).toHaveTextContent("first.ttl uploaded");
        select(file("second.ttl"));
        await completeRequest(await request(1), 200, "second");
        expect(screen.getByText("2 of 2 files completed")).toBeInTheDocument();
        expect(screen.getByRole("status")).toHaveTextContent("second.ttl uploaded");
    });

    it("includes pending and cancelled files in the selection limit", async () => {
        const approval = deferred<boolean>();
        render(<FileUpload name="Limited" endpoint="/files" labels={labels} beforeUpload={() => approval.promise} />);
        select(file("first.ttl"));
        select(file("second.ttl"));
        expect(screen.getByRole("alert")).toHaveTextContent(/only upload 1/i);
        fireEvent.click(screen.getByRole("button", { name: "Cancel upload" }));
        select(file("third.ttl"));
        expect(screen.queryByText("third.ttl")).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "Remove", description: "first.ttl" }));
        select(file("fourth.ttl"));
        expect(screen.getByText("fourth.ttl")).toBeInTheDocument();
    });

    it("uses updated endpoints, headers, method and callbacks for subsequent requests", async () => {
        const oldSuccess = jest.fn(),
            success = jest.fn();
        const { rerender } = render(
            <FileUpload
                name="Current props"
                endpoint="/old"
                method="POST"
                labels={labels}
                maxNumberOfFiles={null}
                onUploadSuccess={oldSuccess}
            />,
        );
        select(file("first.ttl"), file("second.ttl"));
        const first = await request(0);
        rerender(
            <FileUpload
                name="Current props"
                endpoint={(f) => "/new/" + f.name}
                method="PUT"
                labels={labels}
                headers={() => ({ Authorization: "current token" })}
                maxNumberOfFiles={null}
                onUploadSuccess={success}
            />,
        );
        await completeRequest(first, 200, "first");
        const second = await request(1);
        expect(second.url).toBe("/new/second.ttl");
        expect(second.method.toUpperCase()).toBe("PUT");
        expect(second.requestHeaders).toEqual({ Authorization: "current token" });
        await completeRequest(second, 200, "second");
        expect(oldSuccess).not.toHaveBeenCalled();
        expect(success).toHaveBeenCalledTimes(2);
    });

    it("weights progress by bytes and shares a changing concurrency limit across requests", async () => {
        const { rerender } = render(
            <FileUpload name="Concurrent" endpoint="/files" labels={labels} maxNumberOfFiles={null} />,
        );
        select(file("small.ttl", "aa"), file("large.ttl", "bbbbbbbb"), file("last.ttl", "cc"));
        const first = await request(0);
        act(() => first.progress(1, 2));
        expect(screen.getByRole("progressbar", { name: "Overall upload progress" })).toHaveAttribute(
            "aria-valuenow",
            "8",
        );
        expect(ControlledXMLHttpRequest.requests).toHaveLength(1);
        rerender(
            <FileUpload name="Concurrent" endpoint="/files" labels={labels} maxNumberOfFiles={null} concurrency={2} />,
        );
        const second = await request(1);
        expect(ControlledXMLHttpRequest.requests).toHaveLength(2);
        await completeRequest(first, 200, "small");
        const third = await request(2);
        await completeRequest(second, 200, "large");
        await completeRequest(third, 200, "last");
        expect(screen.getByText("3 of 3 files completed")).toBeInTheDocument();
    });

    it("queues a cancelled-file retry behind the active file without another approval", async () => {
        const beforeUpload = jest.fn(async () => true);
        const onComplete = jest.fn();
        render(
            <FileUpload
                name="Retry queue"
                endpoint={(f) => "/files/" + f.name}
                labels={labels}
                maxNumberOfFiles={null}
                beforeUpload={beforeUpload}
                onComplete={onComplete}
            />,
        );
        select(file("first.ttl"), file("second.ttl"));
        const first = await request(0);
        fireEvent.click(within(row("first.ttl")).getByRole("button", { name: "Cancel upload" }));
        const second = await request(1);
        expect(first.aborted).toBe(true);
        fireEvent.click(within(row("first.ttl")).getByRole("button", { name: "Retry" }));
        expect(row("first.ttl")).toHaveAttribute("data-state", "queued");
        expect(ControlledXMLHttpRequest.requests).toHaveLength(2);
        await completeRequest(second, 200, "second");
        const retry = await request(2);
        expect(retry.url).toBe("/files/first.ttl");
        await completeRequest(retry, 200, "first");
        expect(beforeUpload).toHaveBeenCalledTimes(2);
        expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it("reports mixed results and permits a failed file to be retried", async () => {
        const onComplete = jest.fn(),
            onUploadError = jest.fn();
        render(
            <FileUpload
                name="Mixed"
                endpoint="/files"
                labels={labels}
                maxNumberOfFiles={null}
                onComplete={onComplete}
                onUploadError={onUploadError}
            />,
        );
        select(file("good.ttl"), file("bad.ttl"));
        await completeRequest(await request(0), 200, "good");
        for (let attempt = 1; attempt <= 4; attempt++) await completeRequest(await request(attempt), 400, "bad");
        expect(onUploadError).toHaveBeenCalledWith(expect.objectContaining({ kind: "transport", status: 400 }));
        expect(onComplete).toHaveBeenCalledWith(
            expect.objectContaining({
                successful: [expect.anything()],
                failed: [expect.anything()],
            }),
        );
        fireEvent.click(screen.getByRole("button", { name: "Retry" }));
        await completeRequest(await request(5), 200, "recovered");
        expect(screen.getByText("2 of 2 files completed")).toBeInTheDocument();
        expect(onComplete).toHaveBeenCalledTimes(2);
    });

    it("classifies parsing errors without a fallback parser", async () => {
        const onUploadError = jest.fn();
        render(
            <FileUpload
                name="Parser"
                endpoint="/files"
                labels={labels}
                parseResponse={() => {
                    throw new Error("Bad body");
                }}
                onUploadError={onUploadError}
            />,
        );
        select(file("body.ttl"));
        await completeRequest(await request(0), 201, "body");
        expect(onUploadError).toHaveBeenCalledWith(expect.objectContaining({ kind: "response", status: 201 }));
        expect(screen.getByRole("alert")).toHaveTextContent("Invalid response: Bad body");
    });

    it("reports an exhausted network error once", async () => {
        const onUploadError = jest.fn();
        render(<FileUpload name="Network" endpoint="/files" labels={labels} onUploadError={onUploadError} />);
        select(file("body.ttl"));
        for (let attempt = 0; attempt < 4; attempt++) await failRequest(await request(attempt), "Network error");
        await waitFor(() => expect(onUploadError).toHaveBeenCalledTimes(1));
    });

    it("separates selection disabling from retry and full disabling", async () => {
        const ref = React.createRef<FileUploadHandle>();
        const { rerender } = render(<FileUpload ref={ref} name="Disabled" endpoint="/files" labels={labels} />);
        select(file("retry.ttl"));
        await request(0);
        fireEvent.click(screen.getByRole("button", { name: "Cancel upload" }));
        rerender(<FileUpload ref={ref} name="Disabled" endpoint="/files" labels={labels} selectionDisabled />);
        expect(screen.getByRole("button", { name: /browse files/ })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Retry" })).toBeEnabled();
        rerender(<FileUpload ref={ref} name="Disabled" endpoint="/files" labels={labels} disabled />);
        expect(screen.getByRole("button", { name: "Retry" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Remove", description: "retry.ttl" })).toBeEnabled();
        await expect(ref.current!.upload()).rejects.toThrow("disabled");
    });

    it("removes the final unsuccessful row without manufacturing another success or completion", async () => {
        const state = jest.fn(),
            success = jest.fn(),
            complete = jest.fn();
        const ref = React.createRef<FileUploadHandle>();
        render(
            <FileUpload
                ref={ref}
                name="Removal"
                endpoint="/files"
                labels={labels}
                maxNumberOfFiles={null}
                onStateChange={state}
                onUploadSuccess={success}
                onComplete={complete}
            />,
        );
        select(file("good.ttl"), file("cancelled.ttl"));
        await completeRequest(await request(0), 200, "good");
        await request(1);
        fireEvent.click(screen.getByRole("button", { name: "Cancel upload" }));
        await waitFor(() => expect(complete).toHaveBeenCalledTimes(1));
        fireEvent.click(screen.getByRole("button", { name: "Remove", description: "cancelled.ttl" }));
        expect(screen.getByRole("status")).toHaveTextContent("cancelled.ttl removed");
        expect(screen.getByRole("button", { name: /browse files/ })).toHaveFocus();
        expect(state).toHaveBeenLastCalledWith(expect.objectContaining({ progress: 100, allSuccessful: true }));
        expect(success).toHaveBeenCalledTimes(1);
        expect(complete).toHaveBeenCalledTimes(1);
        act(() => ref.current!.reset());
        expect(state).toHaveBeenLastCalledWith(expect.objectContaining({ progress: 0, allSuccessful: false }));
    });

    it.each([null, undefined])("preserves a parser returning %s", async (value) => {
        const success = jest.fn();
        render(
            <FileUpload
                name="Optional result"
                endpoint="/files"
                labels={labels}
                parseResponse={() => value}
                onUploadSuccess={success}
            />,
        );
        select(file("result.ttl"));
        await completeRequest(await request(0), 200, "not-json");
        expect(success).toHaveBeenCalledWith(expect.objectContaining({ body: value }));
    });

    it("initializes native files once in StrictMode and never re-adds them after reset", async () => {
        const ref = React.createRef<FileUploadHandle>();
        const initial = file("initial.ttl");
        const element = () => (
            <React.StrictMode>
                <FileUpload
                    ref={ref}
                    name="Initial"
                    endpoint="/files"
                    labels={labels}
                    initialFiles={[initial]}
                    selectionDisabled
                />
            </React.StrictMode>
        );
        const { rerender } = render(element());
        await completeRequest(await request(0), 200, "initial");
        rerender(element());
        act(() => ref.current!.reset());
        rerender(element());
        await act(async () => {});
        expect(ControlledXMLHttpRequest.requests).toHaveLength(1);
        expect(screen.queryByText("initial.ttl")).not.toBeInTheDocument();
    });

    it("keeps focus in the widget after removing its last actionable row while disabled", async () => {
        const props = { name: "Disabled removal", endpoint: "/files", labels };
        const { rerender } = render(<FileUpload {...props} />);
        select(file("cancelled.ttl"));
        await request(0);
        fireEvent.click(screen.getByRole("button", { name: "Cancel upload" }));
        rerender(<FileUpload {...props} disabled />);
        fireEvent.click(screen.getByRole("button", { name: "Remove", description: "cancelled.ttl" }));
        expect(screen.getByRole("group", { name: "Disabled removal" })).toHaveFocus();
    });

    it("does not confuse transferred bytes with successful HTTP completion", async () => {
        const state = jest.fn(),
            success = jest.fn(),
            complete = jest.fn();
        render(
            <FileUpload
                name="Transferred"
                endpoint="/files"
                labels={labels}
                onStateChange={state}
                onUploadSuccess={success}
                onComplete={complete}
            />,
        );
        select(file("waiting.ttl"));
        const xhr = await request(0);
        act(() => xhr.progress(4, 4));
        expect(state).toHaveBeenLastCalledWith(
            expect.objectContaining({ progress: 100, allSuccessful: false, uploading: 1 }),
        );
        expect(success).not.toHaveBeenCalled();
        expect(complete).not.toHaveBeenCalled();
        await completeRequest(xhr, 200, "done");
        expect(state).toHaveBeenLastCalledWith(expect.objectContaining({ allSuccessful: true, uploading: 0 }));
    });

    it("pauses queued requests when disabled without aborting active work", async () => {
        const props = { name: "Paused", endpoint: "/files", labels, maxNumberOfFiles: null };
        const { rerender } = render(<FileUpload {...props} />);
        select(file("first.ttl"), file("second.ttl"));
        const first = await request(0);
        rerender(<FileUpload {...props} disabled />);
        await completeRequest(first, 200, "done");
        expect(ControlledXMLHttpRequest.requests).toHaveLength(1);
        expect(screen.getByRole("button", { name: "Cancel upload" })).toBeEnabled();
        rerender(<FileUpload {...props} selectionDisabled />);
        await completeRequest(await request(1), 200, "done");
        expect(screen.getByText("2 of 2 files completed")).toBeInTheDocument();
    });

    it("applies initial-file restrictions before approval or transport", async () => {
        const beforeUpload = jest.fn(async () => true);
        render(
            <FileUpload
                name="Restricted"
                endpoint="/files"
                labels={labels}
                acceptedFileTypes={[".ttl"]}
                initialFiles={[file("invalid.txt")]}
                beforeUpload={beforeUpload}
            />,
        );
        await screen.findByRole("alert");
        expect(beforeUpload).not.toHaveBeenCalled();
        expect(ControlledXMLHttpRequest.requests).toHaveLength(0);
    });

    it("uses completed file counts for zero-byte progress and retains cancelled files", async () => {
        const state = jest.fn();
        render(
            <FileUpload name="Empty" endpoint="/files" labels={labels} maxNumberOfFiles={null} onStateChange={state} />,
        );
        select(file("first.ttl", ""), file("second.ttl", ""));
        await completeRequest(await request(0), 200, "done");
        await request(1);
        fireEvent.click(screen.getByRole("button", { name: "Stop uploads" }));
        expect(state).toHaveBeenLastCalledWith(expect.objectContaining({ progress: 50, allSuccessful: false }));
        fireEvent.click(screen.getByRole("button", { name: "Remove", description: "second.ttl" }));
        expect(state).toHaveBeenLastCalledWith(expect.objectContaining({ progress: 100, allSuccessful: true }));
    });

    it("cancels and settles a manual promise on unmount without late callbacks", async () => {
        const ref = React.createRef<FileUploadHandle>();
        const onComplete = jest.fn(),
            onUploadSuccess = jest.fn();
        const { unmount } = render(
            <FileUpload
                ref={ref}
                name="Unmount"
                endpoint="/files"
                labels={labels}
                autoUpload={false}
                onComplete={onComplete}
                onUploadSuccess={onUploadSuccess}
            />,
        );
        select(file("late.ttl"));
        let promise!: Promise<FileUploadResult<string>>;
        act(() => {
            promise = ref.current!.upload();
        });
        const xhr = await request(0);
        unmount();
        expect(await promise).toEqual(expect.objectContaining({ reason: "cancelled" }));
        expect(xhr.aborted).toBe(true);
        await completeRequest(xhr, 200, "late");
        expect(onComplete).not.toHaveBeenCalled();
        expect(onUploadSuccess).not.toHaveBeenCalled();
    });
});
