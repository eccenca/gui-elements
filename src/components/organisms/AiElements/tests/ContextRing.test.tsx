import React from "react";
import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import { ChatErrorBoundary } from "../ChatErrorBoundary";
import { ContextRing } from "../ContextRing";

describe("ContextRing", () => {
    it("renders with a default English aria label built from the token counts", () => {
        render(<ContextRing usedTokens={50_000} maxTokens={200_000} />);
        expect(
            screen.getByRole("img", { name: "Context window: 50,000 of 200,000 tokens used (25%)" }),
        ).toBeInTheDocument();
    });

    it("accepts a localized aria label", () => {
        render(<ContextRing usedTokens={10} maxTokens={100} ariaLabel="Kontextfenster: 10 %" />);
        expect(screen.getByRole("img", { name: "Kontextfenster: 10 %" })).toBeInTheDocument();
    });
});

describe("ChatErrorBoundary", () => {
    const Boom = () => {
        throw new Error("kaputt");
    };

    let consoleError: jest.SpyInstance;
    beforeEach(() => {
        // Both React and the boundary itself report the (intentional) crash.
        consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);
    });
    afterEach(() => consoleError.mockRestore());

    it("shows the default fallback instead of tearing down", () => {
        render(
            <ChatErrorBoundary label="message-1">
                <Boom />
            </ChatErrorBoundary>,
        );
        expect(screen.getByText(/Failed to render this message \(kaputt\)/)).toBeInTheDocument();
    });

    it("supports a custom fallback renderer", () => {
        render(
            <ChatErrorBoundary label="message-1" renderFallback={(error) => <div>Oh nein: {error.message}</div>}>
                <Boom />
            </ChatErrorBoundary>,
        );
        expect(screen.getByText("Oh nein: kaputt")).toBeInTheDocument();
    });
});
