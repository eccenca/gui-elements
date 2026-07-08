import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { NotAvailable } from "../../../index";

export default {
    title: "Components/NotAvailable",
    component: NotAvailable,
    argTypes: {},
} as Meta<typeof NotAvailable>;

const TemplateFull: StoryFn<typeof NotAvailable> = (args) => <NotAvailable {...args} />;

export const Default = TemplateFull.bind({});
Default.args = {};
