import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { loremIpsum } from "react-lorem-ipsum";

import {
  Select,
  Button,
  MenuItem,
} from "../../index";

export default {
  title: "Forms/Select",
  component: Select,
  argTypes: {
  },
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = (args) => (
    <Select {...args}>
        <Button alignText="left" text="Select an element" fill outlined rightIcon="toggler-showmore"/>
    </Select>
);

export const Default = Template.bind({});
Default.args = {
    items: loremIpsum({ p: 1, avgSentencesPerParagraph: 5, random: false })
        .toString()
        .split(".")
        .map((item) => { return { label: item }}),
    itemRenderer: (item, props) => {
        return <MenuItem text={item.label} />
    },
    fill: true,
    filterable: false,
}
