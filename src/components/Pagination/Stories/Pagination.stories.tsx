import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { Pagination } from "../../../../index";
export default {
    title: "Components/Pagination",
    component: Pagination,
    argTypes: {},
} as Meta<typeof Pagination>;

const PaginationExample = (args) => <Pagination {...args} />;

export const Default: StoryFn<typeof Pagination> = PaginationExample.bind({});
Default.args = {
    pageSizes: [10, 20, 50, 100],
    totalItems: 60,
    backwardText: "Previous page",
    forwardText: "Next page",
};

export const ExtendedPagesizeSelection: StoryFn<typeof Pagination> = PaginationExample.bind({});
ExtendedPagesizeSelection.args = {
    ...Default.args,
    pageSizes: [
        { text: "10", value: "10" },
        { text: "20", value: "25" },
        { text: "50", value: "50" },
        { text: "Large page with 100 items", value: "100" },
    ],
};
