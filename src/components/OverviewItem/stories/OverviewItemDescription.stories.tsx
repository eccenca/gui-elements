import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { OverviewItemDescription, OverviewItemLine } from "./../../../../index";

export default {
    title: "Components/OverviewItem/OverviewItemDescription",
    component: OverviewItemDescription,
    subcomponents: {
        OverviewItemLine,
    },
    argTypes: {
        children: {
            control: false,
            description: "Elements for text content.",
        },
    },
} as Meta<typeof OverviewItemDescription>;

const Template: StoryFn<typeof OverviewItemDescription> = (args) => (
    <OverviewItemDescription {...args}></OverviewItemDescription>
);

export const Default = Template.bind({});
Default.args = {
    children: [
        <OverviewItemLine large>
            <h4>Item title</h4>
        </OverviewItemLine>,
        <OverviewItemLine small>
            <LoremIpsum p={1} avgSentencesPerParagraph={4} random={false} />
        </OverviewItemLine>,
    ],
};
