import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { Pagination } from "../../../../index";
export default {
    title: "Components/Pagination",
    component: Pagination,
    argTypes: {},
} as Meta<typeof Pagination>;

const PaginationExample = (args) => <Pagination {...args} />;

const ContainerQueriesExample = (args) => (
    <>
        <Pagination {...args} style={{ maxWidth: "100%" }} />
        <Pagination {...args} style={{ maxWidth: "32rem" }} />
        <Pagination {...args} style={{ maxWidth: "26rem" }} />
    </>
);

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

/**
 * This story demonstrates a minimal pagination and is a check that elements are always hidden.
 */
export const MinimalPagination: StoryFn<typeof Pagination> = PaginationExample.bind({});
MinimalPagination.args = {
    ...Default.args,
    hidePageSizeConfiguration: true,
    hidePageSelect: true,
    hideInfoText: true,
    hideNavigationArrows: false,
    hideBorders: false,
};

/**
 * Demonstrates the breakpoints of the container queries.
 * If the container gets too small, some elements are removed automatically.
 * First, page selector disappears, then the page size selector.
 * Info text and navigation arrow are never hidden automatically.
 */
export const ContainerQueries: StoryFn<typeof Pagination> = ContainerQueriesExample.bind({});
ContainerQueries.args = {
    ...Default.args,
};
