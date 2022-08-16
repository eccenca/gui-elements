import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Button from '../../Button/Button'
import Spacing from '../Spacing'
export default {
    title: "Components/Saperation/Spacing",
    component: Spacing,
 
    argTypes: {
       size : {control : 'radio' , options : ["tiny" , "small" , "medium" , "large"]}
    }

}as ComponentMeta<typeof Spacing>
const SpacingExample: ComponentStory<typeof Spacing> = (args) => (
    <>
     <Button children="Element"/>
     <Spacing {...args}/>
     <Button children="Element"/>
     <Spacing {...args}/>
     <Button children="Element"/>
     <Spacing {...args}/>
     <Button children="Element"/>
     <Spacing {...args}/>
     <Button children="Element"/>
     <Spacing {...args}/>
     <Button children="Element"/>
     
    </>
);


export const Default  = SpacingExample.bind({});
Default.args = {
    size: "tiny",
    hasDivider: false,
    vertical: false
};

