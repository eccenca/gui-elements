/**
 *  This file helps avoid jest errors that arise from codemirror node_module files.
 *  Errors like 'Cannot read keyword of undefined',
 *              '(view, highlightActiveLine) is not a function',
 *              'EditorView is not a constructor'
 * This errors do not exist during compilation only during testing.
 */
//Todo this should become redundant with later patches that avoid this error

import { EditorView, placeholder } from "@codemirror/view";
import { syntaxHighlighting } from "@codemirror/language";
import { Extension } from "@codemirror/state";

/** placeholder extension, current error '_view.placeholder is not a function' */
export const adaptedPlaceholder = (text?: string) =>
    typeof placeholder === "function" ? placeholder(text ?? "") : () => {};

function isConstructor(f: any) {
    try {
        new f();
    } catch (err) {
        // verify err is the expected error and then
        return false;
    }
    return true;
}

/** current error '_view.Editor is not a constructor' */
export const AdaptedEditorView = isConstructor(EditorView)
    ? EditorView
    : class view {
          constructor() {}
          destroy() {}
      };

/** extension adding event handlers, current error '(view, domEventHandlers) is not a function'  */
export const AdaptedEditorViewDomEventHandlers =
    typeof EditorView?.domEventHandlers == "function" ? EditorView?.domEventHandlers : () => {};

export const adaptedSyntaxHighlighting = (style: any) =>
    typeof syntaxHighlighting === "function" ? syntaxHighlighting(style) : ((() => {}) as unknown as Extension);
