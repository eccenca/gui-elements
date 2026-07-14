/**
 * Minimal structural mirrors of the Vercel AI SDK (`ai`) types consumed by the
 * vendored ai-elements chat primitives (conversation / message / tool /
 * prompt-input).
 *
 * WHY: the `ai` / `@ai-sdk/*` packages are NOT a dependency of this wave — a
 * sibling wave decides whether they ever land. To keep the ai-elements folder
 * self-contained and compiling on its own, every `ai` type these components
 * imported is re-declared here, mirroring ONLY the fields the components
 * actually read. Where the real `ai` type carries a `providerMetadata`, it is
 * kept as an optional opaque field so genuine SDK values stay structurally
 * assignable in both directions and the chat-UI wave can adapt without churn.
 *
 * Source of truth: `ai` v6 `dist/index.d.ts` (UIMessage, *UIPart, ChatStatus).
 */

/** Opaque stand-in for `ai`'s ProviderMetadata (never read by the primitives). */
export type ProviderMetadata = Record<string, Record<string, unknown>>;

/** Mirrors `ai` `ChatStatus`. */
export type ChatStatus = "submitted" | "streaming" | "ready" | "error";

export type TextUIPart = {
    type: "text";
    text: string;
    state?: "streaming" | "done";
    providerMetadata?: ProviderMetadata;
};

export type ReasoningUIPart = {
    type: "reasoning";
    text: string;
    state?: "streaming" | "done";
    providerMetadata?: ProviderMetadata;
};

export type SourceUrlUIPart = {
    type: "source-url";
    sourceId: string;
    url: string;
    title?: string;
    providerMetadata?: ProviderMetadata;
};

export type SourceDocumentUIPart = {
    type: "source-document";
    sourceId: string;
    mediaType: string;
    title: string;
    filename?: string;
    providerMetadata?: ProviderMetadata;
};

export type FileUIPart = {
    type: "file";
    mediaType: string;
    filename?: string;
    url: string;
    providerMetadata?: ProviderMetadata;
};

export type StepStartUIPart = { type: "step-start" };

/**
 * The seven tool lifecycle states shared by static and dynamic tool parts (in
 * `ai` these are the discriminants of a union; the primitives only key status
 * label/icon maps off them, so the flat union is sufficient).
 */
export type ToolUIPartState =
    | "input-streaming"
    | "input-available"
    | "approval-requested"
    | "approval-responded"
    | "output-available"
    | "output-error"
    | "output-denied";

/**
 * Static tool part. `ai` types this as a `tool-${name}` template crossed with a
 * per-state union; `tool.tsx` only reads `type`, `state`, `input`, `output` and
 * `errorText`, so those are flattened onto a single object here.
 */
export type ToolUIPart = {
    type: `tool-${string}`;
    toolCallId: string;
    state: ToolUIPartState;
    input?: unknown;
    output?: unknown;
    errorText?: string;
    providerExecuted?: boolean;
    title?: string;
};

/** Dynamic (runtime-named) tool part; carries an explicit `toolName`. */
export type DynamicToolUIPart = {
    type: "dynamic-tool";
    toolName: string;
    toolCallId: string;
    state: ToolUIPartState;
    input?: unknown;
    output?: unknown;
    errorText?: string;
    providerExecuted?: boolean;
    title?: string;
};

export type UIMessagePart =
    | TextUIPart
    | ReasoningUIPart
    | SourceUrlUIPart
    | SourceDocumentUIPart
    | FileUIPart
    | StepStartUIPart
    | ToolUIPart
    | DynamicToolUIPart;

/** Mirrors `ai` `UIMessage` (the fields the primitives read). */
export interface UIMessage {
    id: string;
    role: "system" | "user" | "assistant";
    metadata?: unknown;
    parts: UIMessagePart[];
}
