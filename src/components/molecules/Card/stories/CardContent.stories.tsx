import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import HtmlContentBlock from "@/components/atoms/Typography/HtmlContentBlock";

import { CardContent } from "../index";

export default {
    title: "Components/Card/CardContent",
    component: CardContent,
    argTypes: {
        children: {
            control: { disable: true },
            description: "Elements for card content.",
        },
    },
} as Meta<typeof CardContent>;

const Template: StoryFn<typeof CardContent> = (args) => <CardContent {...args} />;

export const Default = Template.bind({});
Default.args = {
    children: (
        <HtmlContentBlock>
            <LoremIpsum p={2} avgSentencesPerParagraph={4} random={false} />
        </HtmlContentBlock>
    ),
};
