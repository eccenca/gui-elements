import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { OverviewItemLine } from "./../../../../index";

export default {
    title: "Components/OverviewItem/OverviewItemLine",
    component: OverviewItemLine,
    argTypes: {
        children: {
            control: "none",
            description: "Elements for line content.",
        },
    },
} as Meta<typeof OverviewItemLine>;

const Template: StoryFn<typeof OverviewItemLine> = (args) => <OverviewItemLine {...args}></OverviewItemLine>;

export const Default = Template.bind({});
Default.args = {
    children: <LoremIpsum p={1} avgSentencesPerParagraph={4} random={false} />,
};
