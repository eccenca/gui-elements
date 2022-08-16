import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import BreadcrumbList from '../BreadcrumbList'



export default {
    title: "Components/Breadcrumb",
    component:  BreadcrumbList,
    argTypes: {
        disabled: {control : 'boolean'},
        onClick: { action: 'clicked' },
        href : {control : 'text'},
        item : {control : 'object'}

        },
    }  as ComponentMeta<typeof BreadcrumbList>



const TemplateIcons : ComponentStory<typeof BreadcrumbList> = (args) => (
    <>
    <BreadcrumbList  {...args} />
    </>
);
export const breadcrumbElement = TemplateIcons.bind({});
breadcrumbElement.args = {
    disabled: false,
    onClick : (item : any)=> item,
    items : [
                {text : 'Menu' , href : 'https://storybook.js.org/' ,disabled : false },
                {text : 'Dashboard' , href : 'https://storybook.js.org/' ,disabled : false},
                {text : 'Details' , href : 'https://storybook.js.org/',disabled : false},
            ]
};