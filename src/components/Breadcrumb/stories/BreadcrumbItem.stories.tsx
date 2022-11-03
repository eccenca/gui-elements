import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { BreadcrumbItem } from './../../../index';

export default {
    title: "Components/Breadcrumbs/Item",
    component: BreadcrumbItem,
    argTypes: {
    },
}  as ComponentMeta<typeof BreadcrumbItem>

const Template: ComponentStory<typeof BreadcrumbItem> = (args) => (
    <BreadcrumbItem {...args} />
);

export const Default = Template.bind({});
Default.args = {
    text : 'Breadcrumb item',
};
