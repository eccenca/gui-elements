import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { ContentShrinker, HtmlContentBlock } from "../../../index";

export default {
    title: "Components/ContentShrinker",
    component: ContentShrinker,
    argTypes: {},
} as Meta<typeof ContentShrinker>;

const TemplateFull: StoryFn<typeof ContentShrinker> = (args) => <ContentShrinker {...args} />;

export const Default = TemplateFull.bind({});
Default.args = {
    children: (
        <>
            simple text child
            <HtmlContentBlock>
                <LoremIpsum p={10} avgSentencesPerParagraph={10} random={false} />
            </HtmlContentBlock>
        </>
    ),
};
