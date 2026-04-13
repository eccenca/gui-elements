import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { Markdown, StringPreviewContentBlobToggler } from "../../../index";

const config = {
    title: "CMEM/ContentBlobToggler/StringPreview",
    component: StringPreviewContentBlobToggler,
} as Meta<typeof StringPreviewContentBlobToggler>;
export default config;

const Template: StoryFn<typeof StringPreviewContentBlobToggler> = (args) => (
    <StringPreviewContentBlobToggler {...args} />
);

const initialTeststring =
    "A library for GUI elements.\nIn order to create graphical user interfaces, please have look at the documentation at [Github](https://github.com/eccenca/gui-elements).";

export const Default = Template.bind({});
Default.args = {
    content: initialTeststring,
    fullviewContent: <Markdown htmlContentBlockProps={{ large: true }}>{initialTeststring}</Markdown>,
    previewMaxLength: 64,
    renderPreviewAsMarkdown: true,
    toggleExtendText: "show more",
    toggleReduceText: "show less",
};
