import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { helpersArgTypes } from "../../../.storybook/helpers";
import { Button, Spacing } from "../../components";
import Toolbar from "../../components/Toolbar/Toolbar";
import ToolbarSection from "../../components/Toolbar/ToolbarSection";

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
    name: "jsinput",
    mode: "json",
    defaultValue: '{ json: "true" }',
};

export const MarkdownWithToolbar = TemplateFull.bind({});
MarkdownWithToolbar.args = {
    name: "mdinput",
    mode: "markdown",
    defaultValue: "**test me**",
    useToolbar: true,
};

export const LinterExample = TemplateFull.bind({});
LinterExample.args = {
    name: "lintinput",
    defaultValue: "**test me**",
    mode: "javascript",
    useLinting: true,
    autoFocus: true,
};

const externalDefaultValues = [
    '{ "first": "value" }',
    '{ "second": "another value", "more": true }',
    '{ "third": [1, 2, 3] }',
];

const ExternalDefaultValueTemplate: StoryFn<typeof CodeEditor> = (args) => {
    const [defaultValueIndex, setDefaultValueIndex] = React.useState(0);
    return (
        <>
            <Toolbar>
                <ToolbarSection canShrink>
                    {externalDefaultValues.map((value, index) => (
                        <Button
                            key={value}
                            text={`Set default #${index + 1}`}
                            affirmative={index === defaultValueIndex}
                            onClick={() => setDefaultValueIndex(index)}
                        />
                    ))}
                </ToolbarSection>
            </Toolbar>
            <Spacing size="small" />
            <CodeEditor {...args} defaultValue={externalDefaultValues[defaultValueIndex]} />
        </>
    );
};

export const ExternalDefaultValueChange = ExternalDefaultValueTemplate.bind({});
ExternalDefaultValueChange.args = {
    name: "externaldefaultinput",
    mode: "json",
};
