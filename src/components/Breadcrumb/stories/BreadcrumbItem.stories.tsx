import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { BreadcrumbItem } from "./../../../index";

export default {
    title: "Components/Breadcrumbs/Item",
    component: BreadcrumbItem,
    argTypes: {},
} as Meta<typeof BreadcrumbItem>;

const Template: StoryFn<typeof BreadcrumbItem> = (args) => <BreadcrumbItem {...args} />;

export const Default = Template.bind({});
Default.args = {
    text: "Breadcrumb item",
};
