import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { LoremIpsum } from 'react-lorem-ipsum';
import HtmlContentBlock from "../../../components/Typography/HtmlContentBlock";

import {
  CardContent,
} from "../index";

export default {
  title: "Components/Card/CardContent",
  component: CardContent,
  argTypes: {
      children: {
          control: "none",
          description: "Elements for card content."
      }
  },
} as ComponentMeta<typeof CardContent>;

const Template: ComponentStory<typeof CardContent> = (args) => (
    <CardContent {...args} />
);

export const Default = Template.bind({});
Default.args = {
    children: <HtmlContentBlock><LoremIpsum p={2} avgSentencesPerParagraph={4} random={false} /></HtmlContentBlock>,
}
