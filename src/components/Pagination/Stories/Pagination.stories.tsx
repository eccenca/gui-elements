import React from "react"
import Pagination from "../Pagination"
import { ComponentStory, ComponentMeta } from "@storybook/react";
export default {
    title: "Components/Pagination",
    component: Pagination,
    argTypes: {
        totalItems : {control : 'text'},
        page : {control : "text"},
        size : { 
            control : 'select' , options : ['sm' , 'md']
        },
        pageSizes : {control : "object"}
    }
} as ComponentMeta<typeof Pagination>

const PaginationExample = (args) => (
    <>
    <Pagination {...args}/>
    </>
);

export const Default : ComponentStory<typeof Pagination> = PaginationExample.bind({});
Default.args = {
    className : "",
    pageSizes:[
               {text : 'Dashboard' , value : "1"},
               {text : 'details' , value : "15"},
               {text : 'Accounts' , value : "26"},
               {text : 'Context' , value : "34"},
               {text : 'Information' , value : "48"},
               {text : 'Rules' , value : "57"}
            ],
    total : 80,
    totalItems : 60,
    backwardText:"Prev page",
    forwardText : "Next page",
    isLastPage : true,
    pagesUnknown : true
    

};