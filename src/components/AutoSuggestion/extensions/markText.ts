import { StateEffect, StateField } from "@codemirror/state";
import { Decoration, EditorView } from "@codemirror/view";

const addMarks = StateEffect?.define(),
    filterMarks = StateEffect?.define();

// This value must be added to the set of extensions to enable this
export const markField = StateField?.define({
    // Start with an empty set of decorations
    create() {
        return Decoration.none;
    },
    // This is called whenever the editor updates—it computes the new set
    update(value: any, tr) {
        // Move the decorations to account for document changes
        value = value.map(tr.changes);
        // If this transaction adds or removes decorations, apply those changes
        for (const effect of tr.effects) {
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
    config.view.dispatch({
        effects: filterMarks.of(
            ((from: number, to: number) => to <= config.from || from >= config.to) as unknown as null
        ),
    });
};
