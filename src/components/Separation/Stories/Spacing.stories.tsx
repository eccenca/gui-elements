import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Button from '../../Button/Button'
import Spacing from '../Spacing'
export default {
    title: "Components/Separation/Spacing",
    component: Spacing,
    argTypes: {
       size: { control : 'radio'},
    }
} as ComponentMeta<typeof Spacing>

// buttons used for only showing space with elements
const SpacingExample: ComponentStory<typeof Spacing> = (args) => (
    <>
     <Button children="Example element"/>
     <Spacing {...args}/>
     <Button children="Another element"/>
    </>
);

export const Default  = SpacingExample.bind({});
Default.args = {
    size: "medium",
};
