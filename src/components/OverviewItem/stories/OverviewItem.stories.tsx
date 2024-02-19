import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import Card from "../../Card/Card";

import {
    Badge,
    Depiction,
    OverviewItem,
    OverviewItemActions,
    OverviewItemDepiction,
    OverviewItemDescription,
} from "./../../../index";
import { FullExample as OtherDepictionExample } from "./../../Depiction/stories/Depiction.stories";
import { Default as ActionsExample } from "./OverviewItemActions.stories";
import { Default as DepictionExample } from "./OverviewItemDepiction.stories";
import { Default as DescriptionExample } from "./OverviewItemDescription.stories";

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
            control: "none",
            description: "Elements used as depiction, text and interactive elements of an overview-item.",
        },
    },
} as ComponentMeta<typeof OverviewItem>;

const Template: ComponentStory<typeof OverviewItem> = (args) => <OverviewItem {...args}></OverviewItem>;

export const ItemExample = Template.bind({});
ItemExample.args = {
    children: [
        <OverviewItemDepiction {...DepictionExample.args} />,
        <OverviewItemDescription {...DescriptionExample.args} />,
        <OverviewItemActions children={ActionsExample.args.children[0]} hiddenInteractions />,
        <OverviewItemActions children={ActionsExample.args.children[1]} />,
    ],
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
};

const TemplateCard: ComponentStory<typeof OverviewItem> = (args) => (
    <Card isOnlyLayout>
        <OverviewItem {...args}></OverviewItem>
    </Card>
);

export const ItemInCard = TemplateCard.bind({});
ItemInCard.args = {
    ...ItemExample.args,
    hasSpacing: true,
};
