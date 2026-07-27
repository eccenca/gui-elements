import React from "react";
import { act, cleanup, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";

import "@testing-library/jest-dom";

import {
    PromptInput,
    PromptInputActionAddAttachments,
    PromptInputBody,
    PromptInputProvider,
    PromptInputSubmit,
    PromptInputTextarea,
    usePromptInputAttachments,
    usePromptInputController,
    useProviderAttachments,
} from "../prompt-input";

// The InputGroup chrome pulls in Radix, which is awkward to mount in jsdom (and
// orthogonal to what these tests assert). Replace it with plain host elements
// that keep the contracts PromptInput drives: the textarea forwards
// `name="message"` and its handlers (onKeyDown/onPaste), the button its
// `type`/`onClick`/`aria-label`/`disabled`. (Mirrors aiElements.smoke.test.tsx.)
jest.mock("@/_shadcn/ui/input-group", () => {
    const mockReact = require("react");
    return {
        __esModule: true,
        InputGroup: ({ children, className }: Record<string, unknown>) =>
            mockReact.createElement("div", { className }, children),
        InputGroupAddon: ({ children, className }: Record<string, unknown>) =>
            mockReact.createElement("div", { className }, children),
        InputGroupTextarea: (props: Record<string, unknown>) => mockReact.createElement("textarea", props),
        // Drop the non-DOM `size`/`variant` props; forward the rest.
        InputGroupButton: ({ children, size, variant, ...props }: Record<string, unknown>) =>
            mockReact.createElement("button", props, children),
    };
});

// Radix DropdownMenu is a portal/pointer-driven overlay that does not open
// under jsdom. Replace the menu item with a plain button that invokes
// `onSelect` on click (with a preventDefault-capable event), so the
// PromptInputActionAddAttachments → openFileDialog flow is exercised directly.
jest.mock("@/_shadcn/ui/dropdown-menu", () => {
    const mockReact = require("react");
    const passthrough =
        () =>
        ({ children, ...rest }: Record<string, unknown>) =>
            mockReact.createElement("div", rest, children);
    const DropdownMenuItem = ({ children, onSelect, ...rest }: Record<string, unknown>) =>
        mockReact.createElement(
            "button",
            {
                ...rest,
                type: "button",
                onClick: () =>
                    (onSelect as ((e: { preventDefault: () => void }) => void) | undefined)?.({
                        preventDefault: () => undefined,
                    }),
            },
            children,
        );
    return {
        __esModule: true,
        DropdownMenu: passthrough(),
        DropdownMenuPortal: passthrough(),
        DropdownMenuTrigger: passthrough(),
        DropdownMenuContent: passthrough(),
        DropdownMenuGroup: passthrough(),
        DropdownMenuLabel: passthrough(),
        DropdownMenuItem,
        DropdownMenuCheckboxItem: passthrough(),
        DropdownMenuRadioGroup: passthrough(),
        DropdownMenuRadioItem: passthrough(),
        DropdownMenuSeparator: passthrough(),
        DropdownMenuShortcut: passthrough(),
        DropdownMenuSub: passthrough(),
        DropdownMenuSubTrigger: passthrough(),
        DropdownMenuSubContent: passthrough(),
    };
});

// jest-fixed-jsdom's URL.createObjectURL rejects the (undici) File instances we
// build here, and object URLs are irrelevant to what these tests assert. Stub
// the blob-URL lifecycle so add()/clear() stay deterministic.
const realCreate = URL.createObjectURL;
const realRevoke = URL.revokeObjectURL;
beforeAll(() => {
    URL.createObjectURL = jest.fn(() => "blob:mock-url");
    URL.revokeObjectURL = jest.fn();
});
afterAll(() => {
    URL.createObjectURL = realCreate;
    URL.revokeObjectURL = realRevoke;
});

afterEach(cleanup);

// Small consumer that surfaces the composer's attachment list so tests can
// assert what add/remove/paste/drop produced without a preview component.
const AttachmentsProbe = () => {
    const attachments = usePromptInputAttachments();
    return (
        <ul aria-label="attachments">
            {attachments.files.map((f) => (
                <li key={f.id}>{f.filename}</li>
            ))}
        </ul>
    );
};

const makeFile = (name = "a.txt", type = "text/plain") => new File(["hello"], name, { type });

describe("PromptInputProvider attachments context", () => {
    it("add() appends a file part (with id + object URL) and remove() drops it by id", () => {
        const { result } = renderHook(() => useProviderAttachments(), { wrapper: PromptInputProvider });

        expect(result.current.files).toHaveLength(0);

        act(() => result.current.add([makeFile("orders.csv", "text/csv")]));

        expect(result.current.files).toHaveLength(1);
        const [added] = result.current.files;
        expect(added).toMatchObject({ type: "file", filename: "orders.csv", mediaType: "text/csv" });
        expect(typeof added.id).toBe("string");
        expect(added.id.length).toBeGreaterThan(0);
        expect(typeof added.url).toBe("string");

        act(() => result.current.remove(added.id));
        expect(result.current.files).toHaveLength(0);
    });

    it("add() ignores an empty list and clear() removes everything", () => {
        const { result } = renderHook(() => useProviderAttachments(), { wrapper: PromptInputProvider });

        act(() => result.current.add([]));
        expect(result.current.files).toHaveLength(0);

        act(() => result.current.add([makeFile("a.txt"), makeFile("b.txt")]));
        expect(result.current.files).toHaveLength(2);

        act(() => result.current.clear());
        expect(result.current.files).toHaveLength(0);
    });
});

describe("usePromptInputController contract", () => {
    it("throws when used outside <PromptInputProvider>", () => {
        const spy = jest.spyOn(console, "error").mockImplementation(() => undefined);
        expect(() => renderHook(() => usePromptInputController())).toThrow(/PromptInputProvider/);
        spy.mockRestore();
    });

    it("exposes the text-input + attachments API inside the provider", () => {
        const { result } = renderHook(() => usePromptInputController(), { wrapper: PromptInputProvider });

        expect(result.current.textInput.value).toBe("");
        expect(typeof result.current.textInput.setInput).toBe("function");
        expect(typeof result.current.textInput.clear).toBe("function");
        expect(typeof result.current.attachments.add).toBe("function");
        expect(typeof result.current.attachments.remove).toBe("function");
        expect(typeof result.current.__registerFileInput).toBe("function");

        act(() => result.current.textInput.setInput("map orders"));
        expect(result.current.textInput.value).toBe("map orders");

        act(() => result.current.textInput.clear());
        expect(result.current.textInput.value).toBe("");
    });
});

describe("usePromptInputAttachments contract", () => {
    it("throws when used outside a PromptInput / PromptInputProvider", () => {
        const spy = jest.spyOn(console, "error").mockImplementation(() => undefined);
        expect(() => renderHook(() => usePromptInputAttachments())).toThrow(/PromptInput or PromptInputProvider/);
        spy.mockRestore();
    });
});

describe("PromptInputActionAddAttachments", () => {
    it("selecting the menu item opens the hidden file dialog", () => {
        render(
            <PromptInput onSubmit={jest.fn()}>
                <PromptInputBody>
                    <PromptInputTextarea />
                </PromptInputBody>
                <PromptInputActionAddAttachments />
            </PromptInput>,
        );

        const fileInput = screen.getByLabelText("Upload files") as HTMLInputElement;
        // jsdom would otherwise no-op; spy to observe the programmatic open.
        const clickSpy = jest.spyOn(fileInput, "click").mockImplementation(() => undefined);

        fireEvent.click(screen.getByRole("button", { name: /Add photos or files/ }));

        expect(clickSpy).toHaveBeenCalledTimes(1);
    });
});

describe("PromptInput file intake", () => {
    it("pasting files into the textarea adds them as attachments", async () => {
        render(
            <PromptInput onSubmit={jest.fn()}>
                <PromptInputBody>
                    <PromptInputTextarea />
                </PromptInputBody>
                <AttachmentsProbe />
            </PromptInput>,
        );

        const textarea = screen.getByPlaceholderText("What would you like to know?");
        fireEvent.paste(textarea, {
            clipboardData: {
                items: [{ kind: "file", getAsFile: () => makeFile("pasted.png", "image/png") }],
            },
        });

        expect(await screen.findByText("pasted.png")).toBeInTheDocument();
    });

    it("dropping files on the form adds them as attachments", async () => {
        const { container } = render(
            <PromptInput onSubmit={jest.fn()}>
                <PromptInputBody>
                    <PromptInputTextarea />
                </PromptInputBody>
                <AttachmentsProbe />
            </PromptInput>,
        );

        const form = container.querySelector("form") as HTMLFormElement;
        fireEvent.drop(form, {
            dataTransfer: { types: ["Files"], files: [makeFile("dropped.pdf", "application/pdf")] },
        });

        expect(await screen.findByText("dropped.pdf")).toBeInTheDocument();
    });
});

describe("PromptInput submit (provider-controlled)", () => {
    it("hands the typed text + files to onSubmit and then clears both", async () => {
        const onSubmit = jest.fn();

        render(
            <PromptInputProvider>
                <PromptInput onSubmit={onSubmit}>
                    <PromptInputBody>
                        <PromptInputTextarea />
                    </PromptInputBody>
                    <PromptInputSubmit />
                    <AttachmentsProbe />
                </PromptInput>
            </PromptInputProvider>,
        );

        const textarea = screen.getByPlaceholderText("What would you like to know?") as HTMLTextAreaElement;
        fireEvent.change(textarea, { target: { value: "map orders to schema" } });

        // Add a file via the hidden input's change handler.
        const fileInput = screen.getByLabelText("Upload files") as HTMLInputElement;
        fireEvent.change(fileInput, { target: { files: [makeFile("orders.csv", "text/csv")] } });
        expect(await screen.findByText("orders.csv")).toBeInTheDocument();

        fireEvent.submit(textarea.closest("form") as HTMLFormElement);

        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
        const [message] = onSubmit.mock.calls[0];
        expect(message.text).toBe("map orders to schema");
        expect(message.files).toHaveLength(1);
        expect(message.files[0]).toMatchObject({ type: "file", filename: "orders.csv", mediaType: "text/csv" });
        // Submitted parts carry no internal id.
        expect(message.files[0]).not.toHaveProperty("id");

        // Text + attachments are cleared after a successful (sync) submit.
        await waitFor(() => expect(textarea.value).toBe(""));
        expect(screen.queryByText("orders.csv")).toBeNull();
    });
});
