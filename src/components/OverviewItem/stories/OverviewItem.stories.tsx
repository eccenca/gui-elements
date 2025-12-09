import React from "react";
import { OverlaysProvider } from "@blueprintjs/core";
import { Meta, StoryFn } from "@storybook/react";

import {
    Badge,
    Card,
    Depiction,
    OverviewItem,
    OverviewItemActions,
    OverviewItemDepiction,
    OverviewItemDescription,
    OverviewItemLine,
    Tag,
    TagList,
} from "./../../../../index";
import { FullExample as OtherDepictionExample } from "./../../Depiction/stories/Depiction.stories";
import { Default as ActionsExample } from "./OverviewItemActions.stories";
import { AutoTransform as DepictionExample } from "./OverviewItemDepiction.stories";
import { Default as DescriptionExample } from "./OverviewItemDescription.stories";
import { Default as LineExample } from "./OverviewItemLine.stories";

export default {
    title: "Components/OverviewItem",
    component: OverviewItem,
    subcomponents: {
        OverviewItemDepiction,
        OverviewItemDescription,
        OverviewItemActions,
        Card,
    },
    argTypes: {
        children: {
            control: false,
            description: "Elements used as depiction, text and interactive elements of an overview-item.",
        },
    },
} as Meta<typeof OverviewItem>;

const Template: StoryFn<typeof OverviewItem> = (args) => (
    <OverlaysProvider>
        <OverviewItem {...args} />
    </OverlaysProvider>
);

export const ItemExample = Template.bind({});
ItemExample.args = {
    children: [
        <OverviewItemDepiction {...DepictionExample.args} key="depiction" />,
        <OverviewItemDescription {...DescriptionExample.args} key="description" />,
        <OverviewItemActions children={ActionsExample.args.children[0]} hiddenInteractions key="hiddenactions" />,
        <OverviewItemActions children={ActionsExample.args.children[1]} key="actions" />,
    ],
    densityHigh: false,
    hasSpacing: false,
    hasCardWrapper: false,
};

export const ItemWithDepictionElement = Template.bind({});
ItemWithDepictionElement.args = {
    children: [
        <Depiction
            {...OtherDepictionExample.args}
            badge={
                <Badge position="top-right" intent="accent">
                    B
                </Badge>
            }
            ratio="1:1"
            resizing="stretch"
            captionPosition="tooltip"
            border
            rounded
        />,
        <OverviewItemDescription {...DescriptionExample.args} />,
        <OverviewItemActions children={ActionsExample.args.children[0]} hiddenInteractions />,
        <OverviewItemActions children={ActionsExample.args.children[1]} />,
    ],
    densityHigh: false,
    hasSpacing: true,
    hasCardWrapper: true,
};

export const ItemWithTags = Template.bind({});
ItemWithTags.args = {
    children: [
        <OverviewItemDepiction {...DepictionExample.args} key={"depiction"} />,
        <OverviewItemDescription key={"description"}>
            <OverviewItemLine {...LineExample.args} />
            <OverviewItemLine>
                <TagList>
                    <Tag small>Test</Tag>
                    <Tag small>Tag</Tag>
                    <Tag small>List</Tag>
                </TagList>
            </OverviewItemLine>
        </OverviewItemDescription>,
        <OverviewItemActions children={ActionsExample.args.children[0]} key={"actions"} />,
    ],
    densityHigh: false,
    hasSpacing: true,
    hasCardWrapper: true,
};
