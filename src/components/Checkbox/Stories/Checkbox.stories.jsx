import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Checkbox from "../Checkbox"



export default {
    title: "Components/Checkbox",
    component:  Checkbox,
    argTypes: {
        children : {control : 'text'},
        disabled : {control : 'boolean'},
        indeterminate : {control : 'boolean'},
        inline : {control : 'boolean'},
        className : {control : 'text'},
        large : {control : 'boolean'},
        onChange : {action : 'clicked'}
        },
    }

    const TemplateIcons = (args) => (
        <>
        <Checkbox  {...args} ></Checkbox>
        </>
    );
    export const Default = TemplateIcons.bind({});
    Default.args = {
        children : "Checkbox",
        disabled: false,
        indeterminate : false,
        inline : true,
        large : false,
    };