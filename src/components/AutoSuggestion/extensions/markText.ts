import { StateField, StateEffect } from "@codemirror/state";
import { EditorView, Decoration } from "@codemirror/view";

const addMarks = StateEffect.define(),
    filterMarks = StateEffect.define();

// This value must be added to the set of extensions to enable this
export const markField = StateField.define({
    // Start with an empty set of decorations
    create() {
        return Decoration.none;
    },
    // This is called whenever the editor updates—it computes the new set
    update(value: any, tr) {
        // Move the decorations to account for document changes
        value = value.map(tr.changes);
        // If this transaction adds or removes decorations, apply those changes
        for (let effect of tr.effects) {
            if (effect.is(addMarks)) value = value.update({ add: effect.value, sort: true });
            else if (effect.is(filterMarks)) value = value.update({ filter: effect.value });
        }
        return value;
    },
    // Indicate that this field provides a set of decorations
    provide: (f) => EditorView.decorations.from(f),
});

type marksConfig = {
    view: EditorView;
    from: number;
    to: number;
    className?: string;
    title?: string;
};

export const markText = (config: marksConfig) => {
    const strikeMark = Decoration.mark({
        class: config.className,
        attributes: {
            title: config.title ?? "",
        },
    });

    config.view.dispatch({
        effects: addMarks.of([strikeMark.range(config.from, config.to)] as any),
    });

    return { from: config.from, to: config.to };
};

export const removeMarkFromText = (config: marksConfig) => {
    console.log("REMOVE MARKS ==> CALLED", config);
    // config.view.dispatch({
    //     effects: filterMarks.of([(from: number, to: number) => to <= config.from || from >= config.to] as any),
    // });
};

export const getOffsetRange = (cm: EditorView, from: number, to: number) => {
    const cursor = cm.state.selection.main.head;
    const cursorLine = cm.state.doc.lineAt(cursor).number;
    const fromOffset = cm.state.doc.line(cursorLine).from + from;
    const toOffset = cm.state.doc.line(cursorLine).from + to;

    return { fromOffset, toOffset };
};
