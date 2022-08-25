import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { BreadcrumbList, BreadcrumbItem } from './../../../index';

export default {
    title: "Components/Breadcrumbs/List",
    component: BreadcrumbList,
    subcomponents: { BreadcrumbItem },
    argTypes: {
    },
}  as ComponentMeta<typeof BreadcrumbList>

const Template: ComponentStory<typeof BreadcrumbList> = (args) => (
    <BreadcrumbList  {...args} />
);

export const Default = Template.bind({});
Default.args = {
    items : [
        {text: "Root page", href : "#" },
        {text: "Main click category", onClick: () => alert("Breadcrumb click")},
        {text: <div>Sub category item</div>, href: "#"},
        {text: <span>Disabled breadcrumb with a very long title</span>, disabled: true},
        {text: "Current breadcrumb item", current: true}
    ],
};
