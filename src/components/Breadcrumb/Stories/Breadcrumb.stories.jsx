import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import BreadcrumbItem from '../BreadcrumbItem'
import BreadcrumbList from '../BreadcrumbList'
import Spacing from "../../Separation/Spacing";



export default {
    title: "Components/Breadcrumb",
    component:  BreadcrumbItem,
    argTypes: {
        disabled: {control : 'boolean'},
        onClick: { action: 'clicked' },
        href : {control : 'text'},
        item : {control : 'object'}

        },
    }



const TemplateIcons = (args) => (
    <>
    <BreadcrumbList  {...args} />
    </>
);
export const breadcrumbElement = TemplateIcons.bind({});
breadcrumbElement.args = {
    disabled: false,
    onClick : (item)=> item,
    items : [
                {text : 'Menu' , href : 'https://storybook.js.org/' ,disabled : false },
                {text : 'Dashboard' , href : 'https://storybook.js.org/' ,disabled : false},
                {text : 'Details' , href : 'https://storybook.js.org/',disabled : false},
            ]
};