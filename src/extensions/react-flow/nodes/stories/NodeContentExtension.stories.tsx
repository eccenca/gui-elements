import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import IconButton from "@/components/atoms/Icon/IconButton";
import HtmlContentBlock from "@/components/atoms/Typography/HtmlContentBlock";
import { NodeContentExtension, NodeContentExtensionProps } from "@/extensions/react-flow/nodes/NodeContentExtension";

export default {
    title: "Extensions/React Flow/Node Content Extension",
    component: NodeContentExtension,
    argTypes: {
        children: { control: "none" },
        actionButtons: { control: "none" },
    },
} as Meta<typeof NodeContentExtension>;

const Template: StoryFn<typeof NodeContentExtension> = (args: NodeContentExtensionProps) => (
    <NodeContentExtension {...args} /*some comment*/ />
);

export const Default = Template.bind({});
Default.args = {
    actionButtons: (
        <IconButton
            name="item-question"
            onClick={() => {
                alert("this is a action button");
            }}
        />
    ),
    slideOutOfNode: false,
    isExpanded: false,
    setExpanded: (_event: React.MouseEvent<HTMLElement>, expanded: boolean) => {
        return !expanded;
    },
    children: (
        <HtmlContentBlock>
            <h4>Extension example.</h4>
            <LoremIpsum p={2} avgSentencesPerParagraph={4} random={false} />
        </HtmlContentBlock>
    ),
    "data-test-id": "contentextension-test-id",
    "data-testid": "contentextension-testid",
} as NodeContentExtensionProps;

export const SlideOutOfNode = Template.bind({});
SlideOutOfNode.args = {
    ...Default.args,
    slideOutOfNode: true,
} as NodeContentExtensionProps;

export const WithoutExpansionHandler = Template.bind({});
WithoutExpansionHandler.args = {
    ...Default.args,
    setExpanded: undefined,
} as NodeContentExtensionProps;
