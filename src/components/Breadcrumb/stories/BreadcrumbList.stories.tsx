import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { BreadcrumbItem, BreadcrumbList } from "./../../../index";

export default {
    title: "Components/Breadcrumbs/List",
    component: BreadcrumbList,
    subcomponents: { BreadcrumbItem },
    argTypes: {},
} as Meta<typeof BreadcrumbList>;

const Template: StoryFn<typeof BreadcrumbList> = (args) => <BreadcrumbList {...args} />;

export const Default = Template.bind({});
Default.args = {
    onItemClick: undefined,
    items: [
        { text: "Non-click root page" },
        { text: "Main click category", onClick: () => alert("Breadcrumb click") },
        { text: <div>Sub category item</div>, href: "#" },
        {
            text: <span>Disabled breadcrumb with a very long title</span>,
            disabled: true,
            onClick: () => alert("Test click (should not be triggered)"),
        },
        { text: <a href="#wrong">Wrongly placed link inside link</a> },
        { text: "Current breadcrumb item", current: true, href: "#" },
    ],
};
