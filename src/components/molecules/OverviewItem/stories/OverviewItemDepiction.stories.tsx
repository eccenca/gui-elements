import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { Depiction, Icon, OverviewItem, OverviewItemDepiction } from "@/components";
import { FullExample as DepictionExample } from "@/components/molecules/Depiction/stories/Depiction.stories";
import png16to9 from "@/components/molecules/Depiction/stories/test-16to9.png";

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
 * If an `<Icon/>` (or `<TestIcon/>`) is used as only content for `<OverviewItemDepiction/>` then it is rendered centered inside the fixed 36px depiction tile, keeping its own glyph size.
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
