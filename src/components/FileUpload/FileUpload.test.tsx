import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";

import "@testing-library/jest-dom";

import { ApplicationContainer } from "../Application";
import { SimpleDialog } from "../Dialog";

import FileUpload from "./FileUpload";

const labels = {
    dropHereOr: "Drop a project file here or",
    browse: "browse files",
    uploadProgress: "Upload progress",
    overallUploadProgress: "Overall upload progress",
    completedFiles: (completed: number, total: number) => `${completed} of ${total} files completed`,
};

const renderFileUpload = (props: Partial<React.ComponentProps<typeof FileUpload>> = {}) =>
    render(
        <FileUpload
            name="Project file upload"
            endpoint="/files"
            acceptedFileTypes={[".ttl"]}
            labels={labels}
            {...props}
        />,
    );

describe("FileUpload", () => {
    it("renders a named group and a single explicitly named file-selection button", () => {
        renderFileUpload({ instructions: "Turtle files up to 10 MB" });

        const group = screen.getByRole("group", { name: "Project file upload" });
        const button = within(group).getByRole("button", { name: /browse files/i });
        const input = group.querySelector("input[type=file]") as HTMLInputElement;

        expect(button.tagName).toBe("BUTTON");
        expect(button).toHaveAttribute("role", "button");
        expect(button).toHaveAttribute("type", "button");
        expect(button).toHaveAttribute("aria-controls", input.id);
        expect(button).toHaveAccessibleDescription(expect.stringContaining("Turtle files up to 10 MB"));
        expect(group).toHaveAccessibleDescription(expect.stringContaining("Turtle files up to 10 MB"));
        expect(input).toHaveAttribute("accept", ".ttl");
        expect(input).not.toHaveAttribute("multiple");
        expect(input).toHaveAttribute("tabindex", "-1");
        expect(group.querySelector('[data-dropzone-for="Files"]')).toBeInTheDocument();
        expect(group).not.toHaveAttribute("aria-busy");
        expect(within(group).getAllByRole("button")).toHaveLength(1);
    });

    it("creates stable, unique relationships for multiple uploaders", () => {
        const { rerender } = render(
            <>
                <FileUpload name="First upload" endpoint="/first" labels={labels} />
                <FileUpload name="Second upload" endpoint="/second" labels={labels} />
            </>,
        );

        const [firstButton, secondButton] = screen.getAllByRole("button", { name: /browse files/i });
        const firstInputId = firstButton.getAttribute("aria-controls");
        const secondInputId = secondButton.getAttribute("aria-controls");

        expect(firstInputId).not.toBe(secondInputId);
        expect(document.getElementById(firstInputId!)).toBeInstanceOf(HTMLInputElement);
        expect(document.getElementById(secondInputId!)).toBeInstanceOf(HTMLInputElement);

        rerender(
            <>
                <FileUpload name="First upload" endpoint="/first" labels={labels} />
                <FileUpload name="Second upload" endpoint="/second" labels={labels} />
            </>,
        );

        expect(screen.getAllByRole("button", { name: /browse files/i })[0]).toHaveAttribute(
            "aria-controls",
            firstInputId,
        );
    });

    it("adds files selected through the native picker", () => {
        renderFileUpload();
        const input = document.querySelector("input[type=file]") as HTMLInputElement;

        fireEvent.change(input, { target: { files: [new File(["data"], "vocabulary.ttl", { type: "text/turtle" })] } });

        expect(screen.getByRole("status")).toHaveTextContent("vocabulary.ttl");
    });

    it("opens the native picker exactly once per button activation", () => {
        renderFileUpload();
        const input = document.querySelector("input[type=file]") as HTMLInputElement;
        const inputClick = jest.spyOn(input, "click");

        fireEvent.click(screen.getByRole("button", { name: /browse files/i }));

        expect(inputClick).toHaveBeenCalledTimes(1);
    });

    it("adds dropped files with or without an ApplicationContainer", () => {
        const { rerender } = renderFileUpload();
        const file = new File(["data"], "vocabulary.ttl", { type: "text/turtle" });

        fireEvent.drop(document.querySelector('[data-dropzone-for="Files"]')!, { dataTransfer: { files: [file] } });
        expect(screen.getByRole("status")).toHaveTextContent("vocabulary.ttl");

        rerender(
            <ApplicationContainer monitorDropzonesFor={["Files"]}>
                <FileUpload name="Project file upload" endpoint="/files" acceptedFileTypes={[".ttl"]} labels={labels} />
            </ApplicationContainer>,
        );

        fireEvent.drop(document.querySelector('[data-dropzone-for="Files"]')!, { dataTransfer: { files: [file] } });
        expect(screen.getByRole("status")).toHaveTextContent("vocabulary.ttl");
    });

    it("clears application drag monitoring when a drop opens a modal", () => {
        const UploadWithErrorDialog = () => {
            const [dialogOpen, setDialogOpen] = React.useState(false);

            return (
                <ApplicationContainer monitorDropzonesFor={["Files"]}>
                    <FileUpload
                        name="Project file upload"
                        endpoint="/files"
                        acceptedFileTypes={[".ttl"]}
                        labels={labels}
                        onUploadError={() => setDialogOpen(true)}
                    />
                    <SimpleDialog
                        isOpen={dialogOpen}
                        onClose={() => setDialogOpen(false)}
                        title="Upload failed"
                        transitionDuration={0}
                    >
                        The dropped file could not be used.
                    </SimpleDialog>
                </ApplicationContainer>
            );
        };
        render(<UploadWithErrorDialog />);
        fireEvent.dragOver(document.body, { dataTransfer: { types: ["Files"] } });
        expect(document.body).toHaveAttribute("data-monitor-dropzone", "Files");

        fireEvent.drop(document.querySelector('[data-dropzone-for="Files"]')!, {
            dataTransfer: { files: [new File(["data"], "invalid.txt")], types: ["Files"] },
        });
        const monitorDropzone = document.body.dataset.monitorDropzone;
        delete document.body.dataset.monitorDropzone;

        expect(screen.getByText("Upload failed")).toBeInTheDocument();
        expect(monitorDropzone).toBeUndefined();
    });

    it("keeps the drag state while the pointer moves over nested content", () => {
        renderFileUpload();
        const dropzone = document.querySelector('[data-dropzone-for="Files"]')!;
        const button = screen.getByRole("button", { name: /drop a project file here/i });

        fireEvent.dragEnter(dropzone);
        expect(dropzone).toHaveAttribute("data-state", "dragging");

        fireEvent.dragEnter(button);
        fireEvent.dragLeave(button);
        expect(dropzone).toHaveAttribute("data-state", "dragging");

        fireEvent.dragLeave(dropzone, { relatedTarget: document.body });
        expect(dropzone).toHaveAttribute("data-state", "idle");
    });

    it.each([
        ["file type", { acceptedFileTypes: [".ttl"] }, new File(["data"], "invalid.txt")],
        ["file size", { maxFileSize: 3 }, new File(["too large"], "large.ttl")],
    ])("shows %s restriction failures as accessible errors", (_restriction, props, file) => {
        renderFileUpload({
            ...props,
            labels: {
                ...labels,
                restrictionError: (_error, file) => `File rejected: ${file?.name ?? "selection"}`,
            },
        });
        const input = document.querySelector("input[type=file]") as HTMLInputElement;

        fireEvent.change(input, { target: { files: [file] } });

        expect(screen.getByRole("alert")).toHaveTextContent("File rejected:");
        expect(screen.getByRole("button", { name: /browse files/i })).toHaveAccessibleDescription(
            screen.getByRole("alert").textContent!,
        );
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("rejects a selection that exceeds the maximum file count", () => {
        renderFileUpload({ maxNumberOfFiles: 1 });
        const input = document.querySelector("input[type=file]") as HTMLInputElement;

        fireEvent.change(input, {
            target: { files: [new File(["one"], "one.ttl"), new File(["two"], "two.ttl")] },
        });

        expect(screen.getByRole("alert")).not.toBeEmptyDOMElement();
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("uses the localized name as an aria-label when its visible label is hidden", () => {
        renderFileUpload({ hideName: true });

        const group = screen.getByRole("group", { name: "Project file upload" });
        expect(group).toHaveAttribute("aria-label", "Project file upload");
        expect(group).not.toHaveAttribute("aria-labelledby");
        expect(screen.queryByText("Project file upload")).not.toBeInTheDocument();
    });

    it("uses the current error callback after rerender", () => {
        const firstCallback = jest.fn();
        const currentCallback = jest.fn();
        const { rerender } = renderFileUpload({ onUploadError: firstCallback });

        rerender(
            <FileUpload
                name="Project file upload"
                endpoint="/files"
                acceptedFileTypes={[".ttl"]}
                labels={labels}
                onUploadError={currentCallback}
            />,
        );
        fireEvent.change(document.querySelector("input[type=file]")!, {
            target: { files: [new File(["data"], "invalid.txt")] },
        });

        expect(firstCallback).not.toHaveBeenCalled();
        expect(currentCallback).toHaveBeenCalledWith(expect.objectContaining({ kind: "restriction" }));
    });

    it("blocks picker and drop selection while disabled", () => {
        renderFileUpload({ disabled: true });
        const button = screen.getByRole("button", { name: /browse files/i });
        const input = document.querySelector("input[type=file]") as HTMLInputElement;

        expect(button).toBeDisabled();
        expect(input).toBeDisabled();

        fireEvent.change(input, { target: { files: [new File(["data"], "picker.ttl")] } });
        fireEvent.drop(document.querySelector('[data-dropzone-for="Files"]')!, {
            dataTransfer: { files: [new File(["data"], "dropped.ttl")] },
        });

        expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
});
