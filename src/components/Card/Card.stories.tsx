import React from 'react';
import { ComponentStory, ComponentMeta } from "@storybook/react";

import CustomCard from './Card';

export default { 
   title: "Components/Card", 
   component: CustomCard, 
   argTypes: {}
} as ComponentMeta<typeof CustomCard>


const Template: ComponentStory<typeof CustomCard> = (args) => <CustomCard {...args}></CustomCard> 


export const Default = Template.bind({})