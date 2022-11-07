import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Menu, MenuItem } from "../../../../index";
export default {
    title: "Components/Menu/MenuItem",
    component: MenuItem,
    argTypes: {
    }
} as ComponentMeta<typeof MenuItem>

const MenuExample: ComponentStory<typeof MenuItem> = (args) => (
    <Menu style={{width: "200px"}}><MenuItem {...args} /></Menu>
);

export const Default  = MenuExample.bind({});
Default.args = {
    children: (
        <>
        <MenuItem key="m6" text={"Sub option 1"} />
        <MenuItem key="m6" text={"Sub option 2"} />
        </>
    ),
    text: "Parent option",
    key: "m4"
};
