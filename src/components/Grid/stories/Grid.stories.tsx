import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

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
} as ComponentMeta<typeof Grid>;

const Template: ComponentStory<typeof Grid> = (args) => (
    <div style={{ minHeight: "30vh", position: "relative" }}>
        <Grid {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {
    children: <GridRow {...RowExample.args} verticalStretched />,
    verticalStretchable: true,
};
