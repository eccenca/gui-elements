import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import { FloatingCardStack } from "../../../index";

import { TwoCards } from "./FloatingCardStack.stories";

describe("FloatingCardStack", () => {
    it("keeps every card mounted and exposes the inactive card via an activation button", () => {
        render(<FloatingCardStack {...TwoCards.args} />);
        // Both cards are rendered (and stay mounted) even though only one is active.
        expect(screen.getByText("Chat preview")).toBeInTheDocument();
        expect(screen.getByText("Turtle preview")).toBeInTheDocument();
        // The inactive, peeking card is reachable via its `showLabel`.
        expect(screen.getByRole("button", { name: "Show Turtle" })).toBeInTheDocument();
    });

    it("expands the stack onto the activated card and can collapse again", () => {
        render(<FloatingCardStack {...TwoCards.args} />);
        fireEvent.click(screen.getByRole("button", { name: "Show Turtle" }));
        // The activated card is now expanded and shows its collapse control
        // (the FloatingCard chrome's English default label).
        expect(screen.getByText("Turtle expanded content")).toBeInTheDocument();
        const collapse = screen.getByRole("button", { name: "Collapse Turtle" });
        fireEvent.click(collapse);
        // Back to the collapsed preview.
        expect(screen.getByText("Turtle preview")).toBeInTheDocument();
        expect(screen.queryByText("Turtle expanded content")).toBeNull();
    });

    it("reports the collapsed stack height via onHeightChange", () => {
        const onHeightChange = jest.fn();
        render(<FloatingCardStack {...TwoCards.args} onHeightChange={onHeightChange} />);
        expect(onHeightChange).toHaveBeenCalled();
        expect(typeof onHeightChange.mock.calls[0][0]).toBe("number");
    });
});
