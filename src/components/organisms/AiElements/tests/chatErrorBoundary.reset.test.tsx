import React from "react";
import { cleanup, render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import { ChatErrorBoundary } from "../ChatErrorBoundary";

afterEach(cleanup);

// A child that throws on demand, so a single element can flip between the
// crashing and healthy states across re-renders.
const Boom = ({ explode }: { explode: boolean }) => {
    if (explode) {
        throw new Error("kaputt");
    }
    return <div>healthy child</div>;
};

describe("ChatErrorBoundary recovery", () => {
    let consoleError: jest.SpyInstance;
    beforeEach(() => {
        // React + the boundary both log the intentional crash.
        consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);
    });
    afterEach(() => consoleError.mockRestore());

    it("catches a child throw and shows the fallback in place of the subtree", () => {
        render(
            <ChatErrorBoundary label="message-1">
                <Boom explode />
            </ChatErrorBoundary>,
        );

        expect(screen.getByText(/Failed to render this message \(kaputt\)/)).toBeInTheDocument();
        expect(screen.queryByText("healthy child")).toBeNull();
        // The crash is surfaced to the console (never swallowed).
        expect(consoleError).toHaveBeenCalled();
    });

    it("recovers to the healthy child once the boundary is remounted", () => {
        const { rerender } = render(
            <ChatErrorBoundary key="boundary-a" label="message-1">
                <Boom explode />
            </ChatErrorBoundary>,
        );
        expect(screen.getByText(/Failed to render this message/)).toBeInTheDocument();

        // Re-rendering the SAME boundary with a now-healthy child does NOT recover:
        // the boundary has no reset prop, so its error state persists and it keeps
        // showing the fallback. (Pins the current no-auto-reset contract.)
        rerender(
            <ChatErrorBoundary key="boundary-a" label="message-1">
                <Boom explode={false} />
            </ChatErrorBoundary>,
        );
        expect(screen.getByText(/Failed to render this message/)).toBeInTheDocument();
        expect(screen.queryByText("healthy child")).toBeNull();

        // Remounting (fresh key ⇒ fresh boundary state) is the recovery path: the
        // subtree renders normally again.
        rerender(
            <ChatErrorBoundary key="boundary-b" label="message-1">
                <Boom explode={false} />
            </ChatErrorBoundary>,
        );
        expect(screen.getByText("healthy child")).toBeInTheDocument();
        expect(screen.queryByText(/Failed to render this message/)).toBeNull();
    });
});
