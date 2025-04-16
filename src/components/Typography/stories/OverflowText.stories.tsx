import React from "react";
import LoremIpsum, { loremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { OverflowText } from "../../../index";

const config = {
    title: "Components/Typography/OverflowText",
    component: OverflowText,
    argTypes: {
        children: {
            control: "select",
            options: ["simple text", "2 paragraphs"],
            mapping: {
                "simple text": loremIpsum({
                    p: 1,
                    avgSentencesPerParagraph: 4,
                    random: false,
                }),
                "2 paragraphs": <LoremIpsum p={2} avgSentencesPerParagraph={4} random={false} />
            },
            description: "Content of the element.",
        },
    },
} as Meta<typeof OverflowText>;
export default config;

const Template: StoryFn<typeof OverflowText> = (args) => <OverflowText {...args} />;

export const Default = Template.bind({});
Default.args = {
    children: config?.argTypes?.children?.mapping ? config.argTypes.children.mapping["simple text"] : "Overflow text",
};
