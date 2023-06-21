import React from "react";
import { loremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { helpersArgTypes } from "../../../.storybook/helpers";
import { Button, MenuItem, Select } from "../../index";

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
        return <MenuItem text={item.label} />;
    },
    fill: true,
};

export const ControlledTarget = Template.bind({});
ControlledTarget.args = {
    ...Default.args,
    fill: false,
    children: <Button text="Controlled select target" intent="primary" />,
};
