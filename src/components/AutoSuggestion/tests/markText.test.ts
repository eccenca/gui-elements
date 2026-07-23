import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

import { markField, markText, removeMarkFromText } from "../extensions/markText";

describe("markText extensions", () => {
    const createView = (doc: string) => new EditorView({ state: EditorState.create({ doc, extensions: [markField] }) });

    const markCount = (view: EditorView, className: string) => {
        let count = 0;
        view.state.field(markField).between(0, view.state.doc.length, (from, to, value) => {
            if (value.spec.class === className) count += 1;
        });
        return count;
    };

    it("should remove all marks in the range if no class name is given", () => {
        const view = createView("{{project.testx}} and more");
        markText({ view, from: 2, to: 15, className: "error-mark" });
        markText({ view, from: 4, to: 10, className: "highlight-mark" });
        removeMarkFromText({ view, from: 0, to: view.state.doc.length });
        expect(markCount(view, "error-mark")).toBe(0);
        expect(markCount(view, "highlight-mark")).toBe(0);
    });

    it("should only remove marks of the given class if one is given", () => {
        const view = createView("{{project.testx}} and more");
        markText({ view, from: 2, to: 15, className: "error-mark" });
        markText({ view, from: 4, to: 10, className: "highlight-mark" });
        removeMarkFromText({ view, from: 0, to: view.state.doc.length, className: "highlight-mark" });
        expect(markCount(view, "highlight-mark")).toBe(0);
        // The error mark survives, e.g. the validation error marker when suggestion highlighting is removed
        expect(markCount(view, "error-mark")).toBe(1);
    });
});
