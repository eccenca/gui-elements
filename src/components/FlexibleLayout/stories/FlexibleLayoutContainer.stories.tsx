import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { Divider, FlexibleLayoutContainer, FlexibleLayoutItem, HtmlContentBlock } from "../../../../index";

export default {
    title: "Components/FlexibleLayout/Container",
    component: FlexibleLayoutContainer,
} as Meta<typeof FlexibleLayoutContainer>;

const Template: StoryFn<typeof FlexibleLayoutContainer> = (args) => (
    <div style={{ position: "relative", height: "400px" }}>
        <FlexibleLayoutContainer {...args}>
            <FlexibleLayoutItem>
                <HtmlContentBlock>
                    <LoremIpsum p={1} avgSentencesPerParagraph={3} random={false} />
                </HtmlContentBlock>
            </FlexibleLayoutItem>
            <FlexibleLayoutItem>
                <Divider />
                <HtmlContentBlock>
                    <LoremIpsum p={3} avgSentencesPerParagraph={2} random={false} />
                </HtmlContentBlock>
            </FlexibleLayoutItem>
        </FlexibleLayoutContainer>
    </div>
);

export const Default = Template.bind({});
Default.args = {};
