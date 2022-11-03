import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Button from '../../Button/Button'
import Spacing from '../Spacing'
export default {
    title: "Components/Separation/Spacing",
    component: Spacing,
    subcomponents : {Button},
    argTypes: {
       size : {control : 'radio' , options : ["tiny" , "small" , "medium" , "large"]},
       hasDivider : {control : "boolean"},
       vartical : {control : "boolean"}
    }

}as ComponentMeta<typeof Spacing>
// buttons used for only showing space with elements
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
