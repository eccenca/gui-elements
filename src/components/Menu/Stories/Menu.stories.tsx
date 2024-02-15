import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Menu, MenuDivider, MenuItem } from "../../../../index";
import { Default as ContentMenuStory } from "../../ContextOverlay/ContextMenu.stories";
import { Default as MenuItemStory } from "../Stories/MenuItem.stories";

export default {
    title: "Components/Menu",
    component: Menu,
    subcomponents: { MenuItem, MenuDivider },
    argTypes: {
        children: {
            control: "none",
        },
    },
} as ComponentMeta<typeof Menu>;

const MenuExample: ComponentStory<typeof Menu> = (args) => <Menu style={{ width: "200px" }} {...args} />;

export const Default = MenuExample.bind({});
Default.args = {
    children: (
        <>
            {ContentMenuStory.args.children}
            <MenuDivider title="Second menu part" />
            <MenuItem {...MenuItemStory.args} selected />
        </>
    ),
};
