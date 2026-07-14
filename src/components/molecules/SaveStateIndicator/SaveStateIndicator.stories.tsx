import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { SaveStateIndicator } from "@/index";

/** A complete set of display strings, mirroring what the consuming app would pass (already translated). */
const labels = {
    saving: "Saving…",
    savingTooltip: "Saving to backend…",
    unsaved: "Unsaved",
    unsavedTooltip: "Click to save now",
    saveFailed: "Save failed",
    saveFailedTooltip: "Click to retry — network error",
    saved: "Saved 2m ago",
    savedWithWarnings: "Saved with warnings",
};

export default {
    title: "Components/SaveStateIndicator",
    component: SaveStateIndicator,
    argTypes: {
        state: {
            control: "select",
            options: ["saved", "saving", "dirty", "error"],
        },
        onSave: { action: "save" },
        onRetry: { action: "retry" },
    },
} as Meta<typeof SaveStateIndicator>;

const Template: StoryFn<typeof SaveStateIndicator> = (args) => <SaveStateIndicator {...args} />;

export const Saved = Template.bind({});
Saved.args = { state: "saved", lastSavedAt: Date.now(), labels };

export const Saving = Template.bind({});
Saving.args = { state: "saving", labels };

export const Dirty = Template.bind({});
Dirty.args = { state: "dirty", labels };

export const SaveFailed = Template.bind({});
SaveFailed.args = { state: "error", labels };

export const SavedWithWarnings = Template.bind({});
SavedWithWarnings.args = {
    state: "saved",
    lastSavedAt: Date.now(),
    warnings: "1 IRI rule fell back to auto-mint.",
    labels,
};

export const WithExcludedNote = Template.bind({});
WithExcludedNote.args = {
    state: "saved",
    lastSavedAt: Date.now(),
    labels,
    excluded: {
        label: "2 excluded",
        tooltip: "2 nodes are left out of the save. Set a predicate on each to include it and its subtree.",
    },
};
