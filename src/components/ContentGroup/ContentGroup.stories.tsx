import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { Button } from "../Button/Button";
import { Icon } from "../Icon/Icon";

import { ContentGroup } from "./ContentGroup";

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
    contextInfo: <Icon name="item-question" tooltipText="Context info" />,
    annotation: "Annotation",
    actionOptions: <Button>Button</Button>,
    isCollapsed: false,
    handlerToggleCollapse: () => {},
    borderMainConnection: true,
    borderSubConnection: ["red", "blue"],
    level: 1,
    minimumHeadlineLevel: 5,
    whitespaceSize: "small",
    description: "Description",
    hideGroupDivider: false,
};
