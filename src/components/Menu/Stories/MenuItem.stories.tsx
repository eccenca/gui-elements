import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Menu from '../Menu'
import MenuItem from "../MenuItem";
export default {
    title: "Components/Menu/MenuItem",
    component: Menu,
    argTypes: {
       disabled :{
        control: "boolean",
        description: "make item to be desabled"
       },
       active : {
        control: "boolean",
        description: "make item to be in active state"
       },
      text :{
        control: "none",
        description: "text for item"
      },
      icon : {
        control: "none",
        description: "add the icon in the item"
      }
    }

}as ComponentMeta<typeof Menu>

const MenuExample: ComponentStory<typeof Menu> = (args) => (
           <MenuItem  {...args} />
);


export const Default  = MenuExample.bind({});
Default.args = {
  children : [
           <>
               <MenuItem key="m0" text={"child sub options"} />
               <MenuItem key="m1" text={"child sub options"} />
            </>
  ],
  text :"First option", 
};