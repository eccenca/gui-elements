import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { Button, HtmlContentBlock, InteractionGate, Link, Spinner } from "./../../index";

export default {
    title: "Components/InteractionGate",
    component: InteractionGate,
    subcomponents: { Spinner },
    argTypes: {
        children: {
            control: "none",
            description: "Any sub lements, could contain elements that provide options for user interactions.",
        },
    },
} as Meta<typeof InteractionGate>;

const Template: StoryFn<typeof InteractionGate> = (args) => <InteractionGate {...args}></InteractionGate>;

export const Default = Template.bind({});
Default.args = {
    children: (
        <HtmlContentBlock>
            <LoremIpsum p={1} avgSentencesPerParagraph={4} random={false} />
            <p>
                <Link href="https://example.net">Link</Link>
            </p>
            <p>
                <Button onClick={() => alert("click")}>Button</Button>
            </p>
        </HtmlContentBlock>
    ),
};
