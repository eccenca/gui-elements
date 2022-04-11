import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { ActivityControlWidget } from "./ActivityControlWidget";
import { loremIpsum, name } from "react-lorem-ipsum";
import Tag from "../../components/Tag/Tag";
import TagList from "../../components/Tag/TagList";

export default {
    title: "Cmem/ActivityControlWidget",
    component: ActivityControlWidget,
    argTypes: {
        border: {
            table: {
                defaultValue: { summary: false },
                type: { summary: "boolean" },
            },
        },
        small: {
            table: {
                defaultValue: { summary: false },
                type: { summary: "boolean" },
            },
        },
        canShrink: {
            table: {
                defaultValue: { summary: false },
                type: { summary: "boolean" },
            },
        },
    },
} as ComponentMeta<typeof ActivityControlWidget>;

const Template: ComponentStory<typeof ActivityControlWidget> = (args) => <ActivityControlWidget {...args} />;

export const FullExample = Template.bind({});

const actions = [
    {
        "data-test-id": "activity-reload-activity",
        icon: "item-reload",
        action: () => {
            action("click");
        },
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
    label: loremIpsum({ p: 1, avgSentencesPerParagraph: 1, avgWordsPerSentence: 4 }),
    border: true,
    activityActions: actions,
    statusMessage: loremIpsum({ p: 1, startWithLoremIpsum: false }),
    progressSpinner: {
        intent: "none",
        value: 0.5,
    },
};

FullExample.args = {
    ...commonWidgetArgs,
};

const TemplateWithTags: ComponentStory<typeof ActivityControlWidget> = (args) => <ActivityControlWidget {...args} />;

export const WidgetWithTags = TemplateWithTags.bind({});

const widgetTags = (
    <TagList>
        <Tag>{name()}</Tag>
        <Tag>{name()}</Tag>
        <Tag>{name()}</Tag>
    </TagList>
);

WidgetWithTags.args = {
    ...commonWidgetArgs,
    tags: widgetTags,
};
