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

const VisibilityRegressionExample: StoryFn<typeof Pagination> = (args) => (
    <div style={{ display: "grid", gap: "1rem" }}>
        <p style={{ margin: 0, maxWidth: "56rem" }}>
            Both examples below enable <code>hidePageSizeConfiguration</code> and <code>hideNavigationArrows</code>.
            The expected behavior is that the page-size selector and navigation arrows stay hidden regardless of width.
            If the container-query override is active, the wider example will show them again.
        </p>
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(22rem, 1fr))" }}>
            <div style={{ border: "1px solid #c6c6c6", padding: "1rem" }}>
                <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Narrow container (~24rem)</div>
                <div style={{ width: "24rem" }}>
                    <Pagination {...args} />
                </div>
            </div>
            <div style={{ border: "1px solid #c6c6c6", padding: "1rem" }}>
                <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Wide container (~36rem)</div>
                <div style={{ width: "36rem" }}>
                    <Pagination {...args} />
                </div>
            </div>
        </div>
    </div>
);

export const ContainerQueryOverridesHideFlags = VisibilityRegressionExample.bind({});
ContainerQueryOverridesHideFlags.args = {
    ...Default.args,
    hidePageSizeConfiguration: true,
    hideNavigationArrows: true,
};
