import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

import "@testing-library/jest-dom";

import { ChainOfThought, ChainOfThoughtHeader } from "../chain-of-thought";
import { Conversation, ConversationContent } from "../conversation";
import { Message, MessageContent, MessageResponse } from "../message";
import {
    PromptInput,
    PromptInputBody,
    PromptInputProvider,
    PromptInputSubmit,
    PromptInputTextarea,
} from "../prompt-input";
import { getStatusBadge, Tool, ToolHeader, ToolInput, ToolOutput } from "../tool";

// `use-stick-to-bottom` drives scroll behaviour that is meaningless (and
// non-deterministic) in jsdom; stub it with a passthrough <div> + a static
// `.Content` so Conversation/ConversationContent render their children plainly.
jest.mock("use-stick-to-bottom", () => {
    const mockReact = require("react");
    const StickToBottom = ({ children, className, role }: Record<string, unknown>) =>
        mockReact.createElement("div", { className, role }, children);
    StickToBottom.Content = ({ children, className }: Record<string, unknown>) =>
        mockReact.createElement("div", { className }, children);
    return {
        __esModule: true,
        StickToBottom,
        useStickToBottomContext: () => ({ isAtBottom: true, scrollToBottom: jest.fn() }),
    };
});

// The InputGroup chrome pulls in Radix, which is awkward to mount
// in jsdom (and orthogonal to what this test asserts). Replace it with plain
// host elements that keep the contracts PromptInput drives: the textarea must
// forward `name="message"` (read via FormData) and the submit button its
// `type`/`onClick`/`aria-label`.
jest.mock("@/_shadcn/ui/input-group", () => {
    const mockReact = require("react");
    return {
        __esModule: true,
        InputGroup: ({ children, className }: Record<string, unknown>) =>
            mockReact.createElement("div", { className }, children),
        InputGroupAddon: ({ children, className }: Record<string, unknown>) =>
            mockReact.createElement("div", { className }, children),
        InputGroupTextarea: (props: Record<string, unknown>) => mockReact.createElement("textarea", props),
        // Drop the non-DOM `size`/`variant` props; forward the rest (type, onClick, aria-label…).
        InputGroupButton: ({ children, size, variant, ...props }: Record<string, unknown>) =>
            mockReact.createElement("button", props, children),
    };
});

afterEach(cleanup);

describe("ai-elements smoke", () => {
    it("renders a Conversation transcript with a user message and a markdown assistant reply", () => {
        // Exercises the streamdown→react-markdown substitution: bold + inline code
        // + a fenced block that must route through the shared CodeBlock.
        const reply = ["Sure — here is **the plan** and some `code`.", "", "```ts", "const answer = 1", "```"].join(
            "\n",
        );

        render(
            <Conversation>
                <ConversationContent>
                    <Message from="user">
                        <MessageContent>Map orders to schema:Order</MessageContent>
                    </Message>
                    <Message from="assistant">
                        <MessageContent>
                            <MessageResponse>{reply}</MessageResponse>
                        </MessageContent>
                    </Message>
                </ConversationContent>
            </Conversation>,
        );

        // Conversation renders its log role, the user's plain text is present…
        expect(screen.getByRole("log")).toBeInTheDocument();
        expect(screen.getByText("Map orders to schema:Order")).toBeInTheDocument();
        // …and the assistant reply went through react-markdown (bold + inline code)…
        const bold = screen.getByText("the plan");
        expect(bold.tagName).toBe("STRONG");
        const code = screen.getByText("code");
        expect(code.tagName).toBe("CODE");
        // …with the fenced block rendered by CodeBlock: full source in a <pre>,
        // Prism-tokenized (`const` keyword span) since it carries a language tag.
        const keyword = screen.getByText("const");
        expect(keyword.classList.contains("keyword")).toBe(true);
        const pre = keyword.closest("pre");
        expect(pre).not.toBeNull();
        expect(pre?.textContent).toContain("const answer = 1");
    });

    it("renders an untagged ``` fence as a formatted block with preserved newlines", () => {
        // A plain ``` fence (no language) is very common LLM output. It must route
        // through CodeBlock (a <pre> block), NOT collapse into one inline <code>.
        const reply = ["```", "line one", "  indented two", "line three", "```"].join("\n");

        render(
            <Message from="assistant">
                <MessageContent>
                    <MessageResponse>{reply}</MessageResponse>
                </MessageContent>
            </Message>,
        );

        const line = screen.getByText(/line one/);
        const pre = line.closest("pre");
        expect(pre).not.toBeNull();
        // Newlines + indentation survive (all three lines in the same <pre>).
        expect(pre?.textContent).toContain("line one");
        expect(pre?.textContent).toContain("  indented two");
        expect(pre?.textContent).toContain("line three");
    });

    it("keeps inline code inline (not wrapped in a <pre> block)", () => {
        render(<MessageResponse>{"use the `snippet` inline"}</MessageResponse>);
        const code = screen.getByText("snippet");
        expect(code.tagName).toBe("CODE");
        expect(code.closest("pre")).toBeNull();
    });

    it("renders overridable tool labels while keeping English defaults", () => {
        const { rerender } = render(<ToolInput input={{ ok: true }} />);
        // Default English heading.
        expect(screen.getByText("Parameters")).toBeInTheDocument();

        // Overrides render for the status badge, parameters heading, and result heading.
        rerender(
            <>
                {getStatusBadge("input-available", { "input-available": "Läuft" })}
                <ToolInput input={{ ok: true }} parametersLabel="Parameter" />
                <ToolOutput output="done" errorText={undefined} resultLabel="Ergebnis" errorLabel="Fehler" />
            </>,
        );
        expect(screen.getByText("Läuft")).toBeInTheDocument();
        expect(screen.getByText("Parameter")).toBeInTheDocument();
        expect(screen.getByText("Ergebnis")).toBeInTheDocument();
        // The overridden state label replaces the English default entirely.
        expect(screen.queryByText("Running")).toBeNull();
    });

    it("PromptInput hands the typed text (and no files) to onSubmit", async () => {
        const onSubmit = jest.fn();

        // Drive the provider (controlled) flow — the shape the chat-UI wave uses
        // to lift PromptInput state. Here the submit text comes from the shared
        // controller, so the assertion does not depend on the uncontrolled
        // FormData/`event.currentTarget` path (unreliable in jsdom).
        const { container } = render(
            <PromptInputProvider>
                <PromptInput onSubmit={onSubmit}>
                    <PromptInputBody>
                        <PromptInputTextarea />
                    </PromptInputBody>
                    <PromptInputSubmit />
                </PromptInput>
            </PromptInputProvider>,
        );

        const textarea = screen.getByPlaceholderText("What would you like to know?");
        fireEvent.change(textarea, { target: { value: "map orders to schema" } });
        // A real Submit button is rendered/queryable; the form carries the submit.
        expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
        const form = container.querySelector("form");
        expect(form).not.toBeNull();
        fireEvent.submit(form as HTMLFormElement);

        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
        const [message] = onSubmit.mock.calls[0];
        expect(message).toEqual({ text: "map orders to schema", files: [] });
    });

    // The Tool / ChainOfThought primitives mount Radix Collapsible chrome that is
    // awkward to drive in jsdom; a load-check still exercises that both modules
    // (and tool.tsx's `ai`→`./types` swap + its `./code-block` consumer import)
    // resolve and evaluate cleanly.
    it("loads the tool and chain-of-thought modules with their exports intact", () => {
        expect(Tool).toBeDefined();
        expect(ToolHeader).toBeDefined();
        expect(ToolInput).toBeDefined();
        expect(ChainOfThought).toBeDefined();
        expect(ChainOfThoughtHeader).toBeDefined();
    });
});
