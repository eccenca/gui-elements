import "@testing-library/jest-dom";
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { FloatingCard } from "./FloatingCard";

describe("FloatingCard", () => {
    it("renders title and body, and hides header actions while collapsed", () => {
        render(
            <FloatingCard expanded={false} title="Chat" onCollapse={jest.fn()} onTogglePin={jest.fn()}>
                <div>body</div>
            </FloatingCard>,
        );
        expect(screen.getByText("Chat")).toBeInTheDocument();
        expect(screen.getByText("body")).toBeInTheDocument();
        expect(screen.queryByRole("button")).toBeNull();
    });

    it("shows pin + collapse actions when expanded, with overridable labels", () => {
        const onCollapse = jest.fn();
        const onTogglePin = jest.fn();
        render(
            <FloatingCard
                expanded
                title="Chat"
                pinned={false}
                onCollapse={onCollapse}
                onTogglePin={onTogglePin}
                pinLabel="Offen halten"
                collapseLabel="Chat einklappen"
            >
                <div>body</div>
            </FloatingCard>,
        );
        fireEvent.click(screen.getByRole("button", { name: "Offen halten" }));
        expect(onTogglePin).toHaveBeenCalledTimes(1);
        fireEvent.click(screen.getByRole("button", { name: "Chat einklappen" }));
        expect(onCollapse).toHaveBeenCalledTimes(1);
    });

    it("uses English default labels", () => {
        render(
            <FloatingCard expanded title="Chat" pinned onCollapse={jest.fn()} onTogglePin={jest.fn()}>
                <div>body</div>
            </FloatingCard>,
        );
        expect(screen.getByRole("button", { name: "Allow closing on click outside" })).toHaveAttribute(
            "aria-pressed",
            "true",
        );
        expect(screen.getByRole("button", { name: "Collapse Chat" })).toBeInTheDocument();
    });
});
