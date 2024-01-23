import React from "react";
import { loremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { Skeleton } from "./../../../index";

export default {
    title: "Components/Skeleton",
    component: Skeleton,
    argTypes: {},
} as Meta<typeof Skeleton>;

const SkeletonExample: StoryFn<typeof Skeleton> = (args) => <Skeleton {...args} />;

export const Inline = SkeletonExample.bind({});
Inline.args = {
    children: (
        <span className="test">
            {loremIpsum({ p: 1, avgSentencesPerParagraph: 1, avgWordsPerSentence: 3, random: false }).toString()}
        </span>
    ),
};

export const Block = SkeletonExample.bind({});
Block.args = {
    children: (
        <p>{loremIpsum({ p: 1, avgSentencesPerParagraph: 5, avgWordsPerSentence: 8, random: false }).toString()}</p>
    ),
};
