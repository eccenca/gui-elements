import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { Depiction, Icon, OverviewItemDepiction } from "./../../../../index";
import { FullExample as DepictionExample } from "./../../Depiction/stories/Depiction.stories";

export default {
    title: "Components/OverviewItem/OverviewItemDepiction",
    component: OverviewItemDepiction,
    subcomponents: { Icon },
    argTypes: {
        children: {
            control: "none",
            description: "Element used as depiction.",
        },
    },
} as Meta<typeof OverviewItemDepiction>;

const Template: StoryFn<typeof OverviewItemDepiction> = (args) => (
    <OverviewItemDepiction {...args}></OverviewItemDepiction>
);

export const Default = Template.bind({});
Default.args = {
    children: (
        <>
            <Icon name="artefact-dataset" />
        </>
    ),
};

export const UseDepictionElement = Template.bind({});
UseDepictionElement.args = {
    children: <Depiction {...DepictionExample.args} resizing="contain" />,
};
