import { EditorState } from "@codemirror/state";
import { renderHook } from "@testing-library/react";

import { supportedCodeEditorModes, useCodeMirrorModeExtension } from "./useCodemirrorModeExtension.hooks";

it.each(supportedCodeEditorModes)("constructs a usable CodeMirror extension for %s", (mode) => {
    const { result } = renderHook(() => useCodeMirrorModeExtension(mode));
    const state = EditorState.create({ doc: "example", extensions: [result.current] });
    expect(state.doc.toString()).toBe("example");
});

it("supports the default highlighting without a language", () => {
    const { result } = renderHook(() => useCodeMirrorModeExtension());
    expect(() => EditorState.create({ extensions: [result.current] })).not.toThrow();
});
