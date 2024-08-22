import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { CodeEditor } from "./CodeMirror";

export default {
    title: "Extensions/CodeEditor",
    component: CodeEditor,
    //parameters: { actions: { argTypesRegex: '^on.*' } },
    argTypes: {
        onChange: {
            action: "value changed",
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
