import React from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import { PromptInputSubmit } from "../prompt-input";

// Replace the InputGroupButton chrome with a plain <button> that forwards the
// DOM-relevant props (type, disabled, onClick, aria-label) and drops the
// non-DOM size/variant. (Mirrors aiElements.smoke.test.tsx.)
jest.mock("@/_shadcn/ui/input-group", () => {
    const mockReact = require("react");
    return {
        __esModule: true,
        InputGroupButton: ({ children, size, variant, ...props }: Record<string, unknown>) =>
            mockReact.createElement("button", props, children),
    };
});

// The submit button holds a "busy" state with a 250ms trailing delay when
// generation stops; fake timers make that transition deterministic.
beforeEach(() => jest.useFakeTimers());
afterEach(() => {
    act(() => jest.runOnlyPendingTimers());
    jest.useRealTimers();
    cleanup();
});

describe("PromptInputSubmit status/disable states", () => {
    it("idle: labelled Submit and is a real submit button", () => {
        render(<PromptInputSubmit />);
        const button = screen.getByRole("button", { name: "Submit" });
        expect(button).toHaveAttribute("type", "submit");
        expect(button).not.toBeDisabled();
    });

    it("forwards the disabled prop to the button", () => {
        render(<PromptInputSubmit disabled />);
        expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
    });

    it("streaming: switches to a Stop button and clicking stops instead of submitting", () => {
        const onStop = jest.fn();
        const onClick = jest.fn();
        render(<PromptInputSubmit status="streaming" onStop={onStop} onClick={onClick} />);

        const button = screen.getByRole("button", { name: "Stop" });
        // While busy with an onStop handler the button is not a form-submit.
        expect(button).toHaveAttribute("type", "button");

        fireEvent.click(button);
        expect(onStop).toHaveBeenCalledTimes(1);
        // The plain onClick is bypassed while busy so no accidental submit path runs.
        expect(onClick).not.toHaveBeenCalled();
    });

    it("submitted status also reads as busy (Stop)", () => {
        render(<PromptInputSubmit status="submitted" onStop={jest.fn()} />);
        expect(screen.getByRole("button", { name: "Stop" })).toBeInTheDocument();
    });

    it("error status is idle-labelled (Submit) and forwards onClick", () => {
        const onClick = jest.fn();
        render(<PromptInputSubmit status="error" onClick={onClick} />);
        const button = screen.getByRole("button", { name: "Submit" });
        expect(button).toHaveAttribute("type", "submit");
        fireEvent.click(button);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("holds busy briefly after generation stops, then returns to Submit", () => {
        const { rerender } = render(<PromptInputSubmit status="streaming" onStop={jest.fn()} />);
        expect(screen.getByRole("button", { name: "Stop" })).toBeInTheDocument();

        // Generation ends: the button stays busy through the 250ms trailing window…
        rerender(<PromptInputSubmit status="ready" onStop={jest.fn()} />);
        expect(screen.getByRole("button", { name: "Stop" })).toBeInTheDocument();

        // …and flips back to Submit once it elapses.
        act(() => jest.advanceTimersByTime(250));
        expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    });
});
