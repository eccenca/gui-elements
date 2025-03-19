/**
 *  This file helps avoid jest errors that arise from codemirror node_module files.
 *  Errors like 'Cannot read keyword of undefined',
 *              '(view, highlightActiveLine) is not a function',
 *              'EditorView is not a constructor'
 * This errors do not exist during compilation only during testing.
 */
//Todo this should become redundant with later patches that avoid this error

import { EditorView, placeholder, highlightSpecialChars, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { syntaxHighlighting, foldGutter, codeFolding } from "@codemirror/language";
import { Extension } from "@codemirror/state";
import { lintGutter } from "@codemirror/lint";

/** placeholder extension, current error '_view.placeholder is not a function' */
export const adaptedPlaceholder = (text?: string) =>
    typeof placeholder === "function" ? placeholder(text ?? "") : ((() => {}) as unknown as Extension);

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
    : (class view {
          constructor() {}
          destroy() {}
      } as any);

const emptyExtension = (() => {}) as any;
/** extension adding event handlers, current error '(view, domEventHandlers) is not a function'  */
export const AdaptedEditorViewDomEventHandlers =
    typeof EditorView?.domEventHandlers == "function" ? EditorView?.domEventHandlers : emptyExtension;

export const adaptedSyntaxHighlighting = (style: any) =>
    typeof syntaxHighlighting === "function" ? syntaxHighlighting(style) : emptyExtension;

export const adaptedHighlightSpecialChars = (props?: any) =>
    typeof highlightSpecialChars === "function" ? highlightSpecialChars(props) : emptyExtension;

export const adaptedLineNumbers = (props?: any) =>
    typeof lineNumbers === "function" ? lineNumbers(props) : emptyExtension;

export const adaptedHighlightActiveLine = () =>
    typeof highlightActiveLine === "function" ? highlightActiveLine() : emptyExtension;

export const adaptedFoldGutter = (props?: any) =>
    typeof foldGutter === "function" ? foldGutter(props) : emptyExtension;

export const adaptedCodeFolding = (props?: any) =>
    typeof codeFolding === "function" ? codeFolding(props) : emptyExtension;

export const adaptedLintGutter = (props?: any) =>
    typeof lintGutter === "function" ? lintGutter(props) : emptyExtension;
