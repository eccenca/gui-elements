import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Menu from '../Menu'
import MenuDivider from '../MenuDivider'
import MenuItem from '../MenuItem'
import {Default as MenuItemStory} from '../Stories/MenuItem.stories'
export default {
    title: "Components/Menu",
    component: Menu,
    argTypes: {
      children: {
        control: "none",
        description: "Elements to include into the Menu component"
    },
       large  : {
        control: "boolean",
        description: "making elements to be large size"
       },
       href : {
        control: "none",
        description: "access the url"
       }
    }

}as ComponentMeta<typeof Menu>

const MenuExample: ComponentStory<typeof Menu> = (args) => (
           <Menu  {...args} />
);


export const Default  = MenuExample.bind({});
Default.args = {
  children : [
    <>
     <MenuDivider title ="Menu"/>
     <MenuItem  key="m0" text={"First option"}   icon ={[ "operation-filteredit"]}/>
        <MenuItem  key="m1" text={"Item two"} icon ={[ "toggler-tree"]}>
            <MenuItem key="m0" text={"First sub option"} />
            <MenuItem key="m1" text={"Second sub items"} {...MenuItemStory.args} />
      </MenuItem>
    </>
  ],
};