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

let forcedUpdateKey = 0; // @see https://github.com/storybookjs/storybook/issues/13375#issuecomment-1291011856
const TemplateFull: StoryFn<typeof CodeEditor> = (args) => <CodeEditor {...args} key={++forcedUpdateKey} />;

export const BasicExample = TemplateFull.bind({});
BasicExample.args = {
    name: "codeinput",
    mode: "markdown",
    defaultValue: "**test me**",
    useToolbar: true,
    disabled: false,
};

export const LinterExample = TemplateFull.bind({});
LinterExample.args = {
    name: "codeinput",
    defaultValue: "**test me**",
    mode: "javascript",
    useLinting: true,
    autoFocus: true,
};
