/**
 * AI conversation building blocks: a shadcn-based kit for chat transcripts
 * (Conversation/Message), a full prompt composer (PromptInput), tool-call and
 * chain-of-thought disclosure, a shiki-less CodeBlock, a context-window ring,
 * and a per-message error boundary.
 *
 * The kebab-case modules are vendored ai-elements ports (see their headers);
 * the PascalCase modules are lib-authored. The whole kit is exported from the
 * package root as the `AiElements` namespace (mirroring `shadcn`) so its
 * generic names (Message, Tool, ...) never collide with flat exports.
 *
 * The kit is i18n-free by design: user-facing strings are English defaults
 * overridable via props (labels/tooltips), per library convention.
 */
export * from "./types";
export * from "./chain-of-thought";
export * from "./code-block";
export * from "./conversation";
export * from "./message";
export * from "./prompt-input";
export * from "./tool";
export * from "./ContextRing";
export * from "./ChatErrorBoundary";
