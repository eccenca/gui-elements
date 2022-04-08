import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { LoremIpsum } from 'react-lorem-ipsum';

import OverviewItemLine from "./../OverviewItemLine";

export default {
  title: "Components/OverviewItem/OverviewItemLine",
  component: OverviewItemLine,
  argTypes: {
      children: {
          control: "none",
          description: "Elements for line content."
      }
  },
} as ComponentMeta<typeof OverviewItemLine>;

const Template: ComponentStory<typeof OverviewItemLine> = (args) => (
  <OverviewItemLine {...args}></OverviewItemLine>
);

export const Default = Template.bind({});
Default.args = {
    children: <LoremIpsum p={1} avgSentencesPerParagraph={4} random={false} />
}
