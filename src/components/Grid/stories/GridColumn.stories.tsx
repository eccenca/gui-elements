import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Grid, GridColumn, GridRow, HtmlContentBlock } from "../../../../index";

export default {
    title: "Components/Grid/Column",
    component: GridColumn,
    argTypes: {
        children: {
            control: "none",
        },
    },
} as ComponentMeta<typeof GridColumn>;

const Template: ComponentStory<typeof GridColumn> = (args) => (
    <Grid>
        <GridRow>
            <GridColumn {...args} />
        </GridRow>
    </Grid>
);

export const Default = Template.bind({});
Default.args = {
    children: (
        <HtmlContentBlock>
            <h2>This is a column.</h2>
            <LoremIpsum p={2} avgSentencesPerParagraph={3} random={false} />
        </HtmlContentBlock>
    ),
};

const otherColumn = (
    <GridColumn>
        <HtmlContentBlock>
            <h2>This is another column.</h2>
            <LoremIpsum p={3} avgSentencesPerParagraph={2} random={false} />
        </HtmlContentBlock>
    </GridColumn>
);

const TemplateWidths: ComponentStory<typeof GridColumn> = (args) => (
    <Grid>
        <GridRow>
            <GridColumn {...args} />
        </GridRow>
        <GridRow>
            <GridColumn {...args} />
            {otherColumn}
        </GridRow>
        <GridRow>
            <GridColumn {...args} medium />
            {otherColumn}
        </GridRow>
        <GridRow>
            <GridColumn {...args} small />
            {otherColumn}
        </GridRow>
    </Grid>
);

export const Widths = TemplateWidths.bind({});
Widths.args = {
    ...Default.args,
};
