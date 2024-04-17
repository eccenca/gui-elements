import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Pagination } from "../../../../index";
export default {
    title: "Components/Pagination",
    component: Pagination,
    argTypes: {},
} as ComponentMeta<typeof Pagination>;

const PaginationExample = (args) => <Pagination {...args} />;

export const Default: ComponentStory<typeof Pagination> = PaginationExample.bind({});
Default.args = {
    pageSizes: [10, 20, 50, 100],
    totalItems: 60,
    backwardText: "Previous page",
    forwardText: "Next page",
};

export const ExtendedPagesizeSelection: ComponentStory<typeof Pagination> = PaginationExample.bind({});
ExtendedPagesizeSelection.args = {
    ...Default.args,
    pageSizes: [
        { text: "10", value: "10" },
        { text: "20", value: "25" },
        { text: "50", value: "50" },
        { text: "Large page with 100 items", value: "100" },
    ],
};
