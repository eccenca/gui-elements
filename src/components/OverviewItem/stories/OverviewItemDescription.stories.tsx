import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { LoremIpsum } from 'react-lorem-ipsum';

import OverviewItemDescription from "./../OverviewItemDescription";
import OverviewItemLine from "./../OverviewItemLine";

export default {
  title: "Components/OverviewItem/OverviewItemDescription",
  component: OverviewItemDescription,
  subcomponents: {
      OverviewItemLine
  },
  argTypes: {
      children: {
          control: "none",
          description: "Elements for text content."
      }
  },
} as ComponentMeta<typeof OverviewItemDescription>;

const Template: ComponentStory<typeof OverviewItemDescription> = (args) => (
  <OverviewItemDescription {...args}></OverviewItemDescription>
);

export const Default = Template.bind({});
Default.args = {
    children: [
        <OverviewItemLine large><h4>Item title</h4></OverviewItemLine>,
        <OverviewItemLine small><LoremIpsum p={1} avgSentencesPerParagraph={4} random={false} /></OverviewItemLine>
    ]
}
