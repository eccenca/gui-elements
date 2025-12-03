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
            control: false,
        },
    },
    decorators: [
        (Story) => (
            <div style={{ minHeight: "30vh", position: "relative" }}>
                <Story />
            </div>
        ),
    ],
} as Meta<typeof Grid>;

const Template: StoryFn<typeof Grid> = (args) => <Grid {...args} />;

export const Default = Template.bind({});
Default.args = {
    children: [<GridRow {...RowExample.args} verticalStretched />, <GridRow {...RowExample.args} verticalStretched />],
    verticalStretchable: true,
};
