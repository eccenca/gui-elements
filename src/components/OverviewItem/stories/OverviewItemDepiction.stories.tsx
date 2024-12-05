import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import png16to9 from "../../Depiction/stories/test-16to9.png";

import { Depiction, Icon, OverviewItem, OverviewItemDepiction } from "./../../../../index";
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
    <OverviewItem>
        <OverviewItemDepiction {...args}></OverviewItemDepiction>
    </OverviewItem>
);

/**
 * If a `<Depiction/>` is used as only content then it is returned directly by `<OverviewItemDepiction/>`.
 */
export const UseDepictionElement = Template.bind({});
UseDepictionElement.args = {
    children: <Depiction {...DepictionExample.args} resizing="contain" />,
};

/**
 * If an `<Icon/>` (or `<TestIcon/>`) is used as only content for `<OverviewItemDepiction/>` then it returns automatically a `<Depiction/>` element setting the `image` property to that icon.
 */
export const AutoTransform = Template.bind({});
AutoTransform.args = {
    children: (
        <>
            <Icon name="artefact-dataset" />
        </>
    ),
};

/**
 * For all other content the `<OverviewItemDepiction/>` wrapper is set around it to keep it in the allowed size. This works mainly for image content.
 */
export const Default = Template.bind({});
Default.args = {
    children: <img src={png16to9} />,
};
