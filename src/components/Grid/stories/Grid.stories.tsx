import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { Grid, GridColumn, GridRow } from "../../../../index";

import { Default as RowExample } from "./GridRow.stories";

export default {
    title: "Components/Grid",
    component: Grid,
    subcomponents: { GridRow, GridColumn },
    argTypes: {
        children: {
            control: "none",
        },
    },
} as Meta<typeof Grid>;

const Template: StoryFn<typeof Grid> = (args) => (
    <div style={{ minHeight: "30vh", position: "relative" }}>
        <Grid {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {
    children: <GridRow {...RowExample.args} verticalStretched />,
    verticalStretchable: true,
};
