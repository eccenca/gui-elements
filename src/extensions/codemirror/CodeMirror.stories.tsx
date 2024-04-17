import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

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
} as ComponentMeta<typeof CodeEditor>;

const TemplateFull: ComponentStory<typeof CodeEditor> = (args) => <CodeEditor {...args} />;

export const BasicExample = TemplateFull.bind({});
BasicExample.args = {
    name: "codeinput",
    mode: "markdown",
    defaultValue: "**test me**",
};
