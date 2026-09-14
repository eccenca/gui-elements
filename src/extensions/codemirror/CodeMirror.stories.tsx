import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { helpersArgTypes } from "../../../.storybook/helpers";
import { Button } from "../../components/Button/Button";
import { FieldItem } from "../../components/Form/FieldItem";

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
const TemplateFull: StoryFn<typeof CodeEditor> = (args) => (
    <FieldItem labelProps={{ text: "Code input", hidden: true }} key={++forcedUpdateKey} >
        <CodeEditor {...args}/>
    </FieldItem>
);

export const BasicExample = TemplateFull.bind({});
BasicExample.args = {
    name: "jsinput",
    mode: "json",
    defaultValue: '{ json: "true" }',
};

export const LongContent = TemplateFull.bind({});
LongContent.args = {
    name: "long-json-input",
    mode: "json",
    tabIntentStyle: "tab",
    height: "20rem",
    wrapLines: false,
    defaultValue: JSON.stringify(
        {
            name: "Product catalog",
            products: Array.from({ length: 30 }, (_, index) => ({
                id: `product-${index + 1}`,
                name: `Product ${index + 1}`,
                description:
                    "A detailed product description containing specifications, available options, delivery information, and care instructions. This intentionally long line makes it possible to check horizontal scrolling alongside the keyboard navigation hint.",
                available: index % 3 !== 0,
                tags: ["catalog", "featured", "online"],
            })),
        },
        null,
        2,
    ),
};

export const WithActions = TemplateFull.bind({});
WithActions.args = {
    ...BasicExample.args,
    name: "editor-with-actions",
    actions: <Button>Run</Button>,
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
