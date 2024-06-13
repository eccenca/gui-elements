import React from "react";
 import { ComponentStory, ComponentMeta } from "@storybook/react";
import List from '../List'
import MenuItem from "../../Menu/MenuItem";
export default {
    title: "Components/List",
    component: List,
    argTypes: {
        className: {
            description: "A space-delimited list of class names.",
            control: "text",
            table: {
                defaultValue: { summary: undefined },
                type: { summary: "string" },
            }
        },
        itemId : {
            control : "string"
        }
    }

} as ComponentMeta<typeof List>

const ListExample : ComponentStory<typeof List> = (args) => (
    <>
  <List {...args}/>
    </>
);


export const Default  = ListExample.bind({});
Default.args = {
    className : '',
    items : [<MenuItem text = "item1"/> ,<MenuItem text =  "item2"/> ,<MenuItem text =  "item3"/> , <MenuItem text = "item4"/>, <MenuItem text =  "item5"/> ,<MenuItem text =  "item6"/> ,<MenuItem text =  "item7"/> ,<MenuItem text =  "item8"/> ,<MenuItem text =  "item9"/> ,<MenuItem text =  "item10"/> ,<MenuItem text =  "item11"/> ,<MenuItem text =  "item12"/>],
    limitOptions: {
        initialMax : 1,
        stepSize : 4
    },
    itemRenderer : (item : any)=> item,
    itemId : (idx : any) => idx
};