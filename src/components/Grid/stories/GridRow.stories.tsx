import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { Grid, GridColumn, GridRow } from "../../../../index";

import { Default as ColumnExample } from "./GridColumn.stories";

export default {
    title: "Components/Grid/Row",
    component: GridRow,
    argTypes: {
        children: {
            control: false,
        },
    },
} as Meta<typeof GridRow>;

const Template: StoryFn<typeof GridRow> = (args) => <GridRow {...args} />;

export const Default = Template.bind({});
Default.args = {
    children: [
        <GridColumn {...ColumnExample.args} verticalAlign="center" key="col1" />,
        <GridColumn {...ColumnExample.args} verticalAlign="center" key="col1" />,
    ],
};
Default.decorators = [
    (Story) => (
        <Grid style={{ minHeight: "30vh" }} verticalStretchable>
            <Story />
        </Grid>
    ),
];

const TemplateStretched: StoryFn<typeof GridRow> = (args) => (
    <Grid style={{ minHeight: "50vh" }} verticalStretchable>
        <GridRow {...args}>
            <GridColumn>Top row.</GridColumn>
        </GridRow>
        <GridRow {...args} verticalStretched>
            <GridColumn verticalAlign="center">Stretched row.</GridColumn>
        </GridRow>
        <GridRow {...args} verticalStretched>
            <GridColumn verticalAlign="center">Stretched row.</GridColumn>
        </GridRow>
        <GridRow {...args}>
            <GridColumn>Bottom row.</GridColumn>
        </GridRow>
    </Grid>
);

export const VerticalStretched = TemplateStretched.bind({});
VerticalStretched.args = {
    ...Default.args,
};
