/**
 * Public barrel for the vendored ai-elements `prompt-input` kit (source:
 * mapping-creator-2 `components/ai-elements/prompt-input.tsx`). Previously a single
 * ~1.2k-line module; split into focused files behind this index with the public API
 * kept byte-for-byte stable. Consumed via the package-root `AiElements` namespace
 * (`export * from "./prompt-input"` in `../index.ts`), and re-exported wholesale by
 * MC2's `components/ai-elements/prompt-input.tsx` — every export name below must stay.
 *
 * PORT NOTE: the Vercel AI SDK (`ai`) is not a dependency of this wave, so its
 * `ChatStatus` / `FileUIPart` / `SourceDocumentUIPart` types are replaced by the local
 * structural mirrors in `../types`. All UI chrome resolves through the `_shadcn/ui/*`
 * primitives; `nanoid` is an installed dep.
 *
 * Foundation (`./context`) is re-exported selectively so the internal contexts and the
 * `useOptional*` hooks stay off the public surface, exactly as in the original module.
 * The leaf UI modules contain only public exports, hence the bare `export *`.
 */
export {
    LocalReferencedSourcesContext,
    PromptInputProvider,
    useProviderAttachments,
    usePromptInputAttachments,
    usePromptInputController,
    usePromptInputReferencedSources,
} from "./context";
export type {
    AttachmentsContext,
    PromptInputControllerProps,
    PromptInputProviderProps,
    ReferencedSourcesContext,
    TextInputContext,
} from "./context";

export * from "./input";
export * from "./layout";
export * from "./textarea";
export * from "./button";
export * from "./action-menu";
export * from "./attachments";
export * from "./submit";
export * from "./select";
export * from "./hover-card";
export * from "./tabs";
export * from "./command";
