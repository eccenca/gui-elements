import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Grid, GridRow, GridColumn } from "../../../../index";
import { Default as ColumnExample } from "./GridColumn.stories";

export default {
    title: "Components/Grid/Row",
    component: GridRow,
    argTypes: {
        children: {
            control: "none",
        }
    },
} as ComponentMeta<typeof GridRow>;

const Template: ComponentStory<typeof GridRow> = (args) => (
    <Grid style={{minHeight: "30vh"}} verticalStretchable>
        <GridRow {...args} />
    </Grid>
);

export const Default = Template.bind({});
Default.args = {
    children: <GridColumn {...ColumnExample.args} verticalAlign="center" />,
}

const TemplateStretched: ComponentStory<typeof GridRow> = (args) => (
    <Grid style={{minHeight: "50vh"}} verticalStretchable>
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
    ...Default.args
}
