import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { Badge, ContentGroup, HtmlContentBlock, IconButton, Tag } from "../../../index";

export default {
    title: "Components/ContentGroup",
    component: ContentGroup,
    argTypes: {
        handlerToggleCollapse: {
            action: "toggle collapse",
        },
    },
} as Meta<typeof ContentGroup>;

const TemplateFull: StoryFn<typeof ContentGroup> = (args) => <ContentGroup {...args} />;

export const BasicExample = TemplateFull.bind({});
BasicExample.args = {
    title: "Content group title",
    contextInfo: <Badge children={100} maxLength={3} intent={"warning"} title="Found warnings context." />,
    annotation: (
        <Tag backgroundColor={"purple"} round>
            Context tag
        </Tag>
    ),
    actionOptions: (
        <>
            <IconButton name="item-remove" text="Example remove tooltip" disruptive />
        </>
    ),
    isCollapsed: false,
    handlerToggleCollapse: () => {},
    borderMainConnection: true,
    borderSubConnection: ["red", "blue"],
    level: 1,
    minimumHeadlineLevel: 5,
    whitespaceSize: "small",
    description: "More context description by tooltip.",
    hideGroupDivider: false,
    children: (
        <HtmlContentBlock>
            <LoremIpsum p={3} avgSentencesPerParagraph={4} random={false} />
        </HtmlContentBlock>
    ),
};
