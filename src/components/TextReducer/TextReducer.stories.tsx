import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { HtmlContentBlock, Markdown, TextReducer } from "../../../index";

export default {
    title: "Components/TextReducer",
    component: TextReducer,
    argTypes: {},
} as Meta<typeof TextReducer>;

const TemplateFull: StoryFn<typeof TextReducer> = (args) => <TextReducer {...args} />;

export const Default = TemplateFull.bind({});
Default.args = {
    children: [
        <LoremIpsum p={1} avgSentencesPerParagraph={1} random={false} />,
        "Simple text with URL http://example.com/ that should not get parsed.",
        "a < b to test equations in text like b > a.",
        <>
            <Markdown>{`* This\n* is\n* a\n* list\n\nwritten in Markdown.`}</Markdown>
            <HtmlContentBlock>
                <h1>Block with sub elements</h1>
                <LoremIpsum p={3} avgSentencesPerParagraph={3} random={false} />
            </HtmlContentBlock>
        </>,
    ],
};

export const UseMaximumContraints = TemplateFull.bind({});
UseMaximumContraints.args = {
    ...Default.args,
    maxNodes: 3,
    maxLength: 130,
};

export const WithOverflowText = TemplateFull.bind({});
WithOverflowText.args = {
    ...Default.args,
    useOverflowTextWrapper: true,
    overflowTextProps: {
        className: "my-extra-class",
        "data-test-id": "my-test-id",
        ellipsis: "reverse",
    },
};
