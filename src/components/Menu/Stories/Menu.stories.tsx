import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Menu, MenuItem, MenuDivider } from "../../../../index";
import { Default as MenuItemStory } from '../Stories/MenuItem.stories';
import { Default as ContentMenuStory } from '../../ContextOverlay/ContextMenu.stories';

export default {
    title: "Components/Menu",
    component: Menu,
    subcomponents: {MenuItem, MenuDivider},
    argTypes: {
        children: {
            control: "none",
        },
    }
} as ComponentMeta<typeof Menu>

const MenuExample: ComponentStory<typeof Menu> = (args) => (
    <Menu style={{width: "200px"}} {...args} />
);

export const Default  = MenuExample.bind({});
Default.args = {
    children : (
        <>
            {ContentMenuStory.args.children}
            <MenuDivider title ="Second menu part"/>
            <MenuItem {...MenuItemStory.args} selected />
        </>
    ),
};
