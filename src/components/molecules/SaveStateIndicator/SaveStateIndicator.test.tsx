import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import { SaveStateIndicator } from "@/index";

import { Dirty, Saved, SavedWithWarnings, SaveFailed, Saving, WithExcludedNote } from "./SaveStateIndicator.stories";

describe("SaveStateIndicator", () => {
    it("renders the saving label as a non-interactive chip", () => {
        render(<SaveStateIndicator {...Saving.args} />);
        expect(screen.getByText("Saving…")).toBeInTheDocument();
        expect(screen.queryByRole("button")).toBeNull();
    });

    it("renders a button that triggers onSave when there are unsaved changes", () => {
        const onSave = jest.fn();
        render(<SaveStateIndicator {...Dirty.args} onSave={onSave} />);
        expect(screen.getByText("Unsaved")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button"));
        expect(onSave).toHaveBeenCalledTimes(1);
    });

    it("renders a retry button that triggers onRetry after a failed save", () => {
        const onRetry = jest.fn();
        render(<SaveStateIndicator {...SaveFailed.args} onRetry={onRetry} />);
        expect(screen.getByText("Save failed")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button"));
        expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it("shows the plain saved label without warnings and the warnings label with them", () => {
        const { rerender } = render(<SaveStateIndicator {...Saved.args} />);
        expect(screen.getByText("Saved 2m ago")).toBeInTheDocument();
        rerender(<SaveStateIndicator {...SavedWithWarnings.args} />);
        expect(screen.getByText("Saved with warnings")).toBeInTheDocument();
        expect(screen.queryByText("Saved 2m ago")).toBeNull();
    });

    it("renders the excluded note alongside the status", () => {
        render(<SaveStateIndicator {...WithExcludedNote.args} />);
        expect(screen.getByText("Saved 2m ago")).toBeInTheDocument();
        expect(screen.getByText("2 excluded")).toBeInTheDocument();
    });

    it("renders nothing when there is neither a state nor an excluded note", () => {
        const { container } = render(<SaveStateIndicator {...Saving.args} state={undefined} />);
        expect(container).toBeEmptyDOMElement();
    });
});
