import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import {
  CardHeader,
  Card as CustomCard,
  CardContent,
  CardTitle,
  CardOptions,
  CardActions,
  CardActionsAux,
} from ".";
import Divider from "../Separation/Divider";

export default {
  title: "Components/Card",
  component: CustomCard,
  subcomponents: {
    CardHeader,
    CardContent,
    CardTitle,
    CardOptions,
    CardActions,
    CardActionsAux,
  },
  argTypes: {},
} as ComponentMeta<typeof CustomCard>;

const Template: ComponentStory<typeof CustomCard> = (args) => (
  <CustomCard {...args}>
    <CardHeader>
      <CardTitle>
        <h2>Card title</h2>
      </CardTitle>
    </CardHeader>
    <Divider />
    <CardContent></CardContent>
  </CustomCard>
);

export const Default = Template.bind({});
