import React from "react";
import LoremIpsum, { loremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { HtmlContentBlock } from "../../../index";

const whiteSpaceSizeOptions = {
    control: "select",
    options: {
        "not set": undefined,
        tiny: "tiny",
        small: "small",
        regular: "regular",
        large: "large",
        xlarge: "xlarge",
    },
};

export default {
    title: "Components/Typography/HtmlContentBlock",
    component: HtmlContentBlock,
    argTypes: {
        children: { control: false },
    },
} as Meta<typeof HtmlContentBlock>;

const Template: StoryFn<typeof HtmlContentBlock> = (args) => <HtmlContentBlock {...args} />;

const testContent = (
    <>
        <LoremIpsum p={2} avgSentencesPerParagraph={4} random={false} />
        <p>
            <strong>
                {loremIpsum({
                    p: 2,
                    avgSentencesPerParagraph: 4,
                    random: false,
                })
                    .toString()
                    .replaceAll(" ", "")}
            </strong>
        </p>
        <LoremIpsum p={3} avgSentencesPerParagraph={5} random={false} />
    </>
);

export const Default = Template.bind({});
Default.args = {
    children: testContent,
};
