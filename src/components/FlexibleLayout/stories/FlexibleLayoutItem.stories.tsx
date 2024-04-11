import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { FlexibleLayoutContainer, FlexibleLayoutItem, HtmlContentBlock } from "../../../../index";

export default {
    title: "Components/FlexibleLayout/Item",
    component: FlexibleLayoutItem,
} as Meta<typeof FlexibleLayoutItem>;

const Template: StoryFn<typeof FlexibleLayoutItem> = (args) => (
    <FlexibleLayoutContainer horizontal>
        <FlexibleLayoutItem {...args}>
            <HtmlContentBlock>
                <LoremIpsum p={1} avgSentencesPerParagraph={1} avgWordsPerSentence={3} random={false} />
            </HtmlContentBlock>
        </FlexibleLayoutItem>
        <FlexibleLayoutItem>
            <HtmlContentBlock>
                <LoremIpsum p={2} avgSentencesPerParagraph={4} random={false} />
            </HtmlContentBlock>
        </FlexibleLayoutItem>
    </FlexibleLayoutContainer>
);

export const Default = Template.bind({});
Default.args = {};
