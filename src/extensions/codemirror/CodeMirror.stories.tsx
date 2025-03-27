import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { helpersArgTypes } from "../../../.storybook/helpers";

import { CodeEditor } from "./CodeMirror";

export default {
    title: "Extensions/CodeEditor",
    component: CodeEditor,
    //parameters: { actions: { argTypesRegex: '^on.*' } },
    argTypes: {
        onChange: {
            action: "value changed",
        },
        intent: {
            ...helpersArgTypes.exampleIntent,
        },
    },
} as Meta<typeof CodeEditor>;

const TemplateFull: StoryFn<typeof CodeEditor> = (args) => <CodeEditor {...args} />;

export const BasicExample = TemplateFull.bind({});
BasicExample.args = {
    name: "codeinput",
    mode: "markdown",
    defaultValue: "**test me**",
};

export const LinterExample = TemplateFull.bind({});
LinterExample.args = {
    name: "codeinput",
    defaultValue: "**test me**",
    mode: "javascript",
    useLinting: true,
    autoFocus: true,
};

export const DisabledExample = TemplateFull.bind({});
DisabledExample.args = {
    name: "codeinput",
    defaultValue: "**test me**",
    mode: "javascript",
    disabled: true,
};

export const IntentExample = TemplateFull.bind({});
IntentExample.args = {
    name: "codeinput",
    defaultValue: "**test me**",
    mode: "javascript",
    intent: "warning",
};
export const MarkdownWithToolbarExample = TemplateFull.bind({});
MarkdownWithToolbarExample.args = {
    name: "codeinput",
    defaultValue: "**test me**",
    mode: "markdown",
    useToolbar: true,
};
