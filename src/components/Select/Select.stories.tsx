import React from "react";
import { loremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";
import { fn } from "@storybook/test";

import { helpersArgTypes } from "../../../.storybook/helpers";
import { Button, Depiction, MenuItem, Select } from "../../index";
import { FullExample as DepictionExample } from "../Depiction/stories/Depiction.stories";

export default {
    title: "Forms/Select",
    component: Select,
    argTypes: {
        icon: {
            ...helpersArgTypes.exampleIcon,
        },
        rightIcon: {
            ...helpersArgTypes.exampleIcon,
        },
    },
} as Meta<typeof Select>;

const Template: StoryFn<typeof Select> = (args) => <Select {...args} />;

export const Default = Template.bind({});
Default.args = {
    items: loremIpsum({ p: 1, avgSentencesPerParagraph: 5, random: false })
        .toString()
        .split(".")
        .map((item) => {
            return { label: item };
        }),
    itemRenderer: (item, props) => {
        return <MenuItem text={item.label} title={item.label} {...props} />;
    },
    fill: true,
};

/**
 * Using a `Depiction` element instead of a simple `icon` name
 */
export const UsingDepictionAsIcon = Template.bind({});
UsingDepictionAsIcon.args = {
    ...Default.args,
    icon: <Depiction {...DepictionExample.args} size="tiny" resizing="cover" ratio="1:1" />,
};

/**
 * A controlled select target is used by adding `children` elements to `<Select />` directly.
 * Properties like `text`, `placeholder`, `onClearanceHandler` and `onClearanceText` won't be evaluated then.
 */
export const ControlledTarget = Template.bind({});
ControlledTarget.args = {
    ...Default.args,
    fill: false,
    children: <Button text="Controlled select target" intent="primary" />,
    onActiveItemChange: fn(),
};

/**
 * If the selection is not mandatory it is suggested to add an option letting the user reset the select value.
 * `onClearanceHandler` follows the pattern to add a button on the right side of the element.
 * An alternate way would be to add an additional select item to reset the value but this could come with a few usablity issues:
 * user do not see it when the options are filtered, or the "empty" select option leads to the pre-selected option, etc.
 */
export const ClearanceOption = Template.bind({});
ClearanceOption.args = {
    ...Default.args,
    text: "Example selection",
    onClearanceText: "Reset the selection",
    //onClearanceHandler: false,
    onClearanceHandler: () => {
        alert("Reset now.");
    },
    onActiveItemChange: fn(),
};
