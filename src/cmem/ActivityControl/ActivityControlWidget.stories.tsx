import React from "react";
import { loremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { helpersArgTypes } from "../../../.storybook/helpers";
import { ActivityControlWidget, Tag, TagList } from "../../../index";

export default {
    title: "Cmem/ActivityControlWidget",
    component: ActivityControlWidget,
    argTypes: {
        progressSpinnerFinishedIcon: {
            ...helpersArgTypes.exampleIcon,
        },
    },
} as Meta<typeof ActivityControlWidget>;

const Template: StoryFn<typeof ActivityControlWidget> = (args) => <ActivityControlWidget {...args} />;

export const FullExample = Template.bind({});

const actions = [
    {
        "data-test-id": "activity-reload-activity",
        icon: "item-reload",
        action: () => {},
        tooltip: "Reload Activity",
        disabled: false,
    },
    {
        "data-test-id": "activity-start-activity",
        icon: "item-start",
        action: () => console.log("start"),
        tooltip: "Start Activity",
        disabled: false,
    },
    {
        "data-test-id": "activity-stop-activity",
        icon: "item-stop",
        action: () => console.log("cancel"),
        tooltip: "Stop Activity",
        disabled: false,
    },
    {
        "data-test-id": "activity-view-data",
        icon: "artefact-rawdata",
        action: () => {},
        tooltip: "preview report",
    },
];

const commonWidgetArgs = {
    label: loremIpsum({ p: 1, avgSentencesPerParagraph: 1, avgWordsPerSentence: 4, random: false }).toString(),
    border: true,
    activityActions: actions,
    statusMessage: loremIpsum({ p: 1, startWithLoremIpsum: false, random: false }).toString(),
    progressSpinner: {
        intent: "none",
        value: 0.5,
    },
};

FullExample.args = {
    ...commonWidgetArgs,
};

const TemplateWithTags: StoryFn<typeof ActivityControlWidget> = (args) => <ActivityControlWidget {...args} />;

export const WidgetWithTags = TemplateWithTags.bind({});

const widgetTags = (
    <TagList>
        <Tag small>Tag one</Tag>
        <Tag small>Other tag</Tag>
        <Tag small>Third keyword</Tag>
    </TagList>
);

WidgetWithTags.args = {
    ...commonWidgetArgs,
    tags: widgetTags,
};
