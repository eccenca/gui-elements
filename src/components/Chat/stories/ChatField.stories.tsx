import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { ChatField } from "../../../index";

export default {
    title: "Components/Chat/ChatField",
    component: ChatField,
    argTypes: {},
} as Meta<typeof ChatField>;

let forceupdate = 0;
const TemplateFull: StoryFn<typeof ChatField> = (args) => <ChatField {...args} key={forceupdate++} />;

export const Default = TemplateFull.bind({});
Default.args = {
    onTextSubmit: (value) => alert(value),
};
