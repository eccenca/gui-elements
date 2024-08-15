import React from "react";
import { OverlaysProvider } from "@blueprintjs/core";
import { Meta, StoryFn } from "@storybook/react";

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
} as Meta<typeof Menu>;

const MenuExample: StoryFn<typeof Menu> = (args) => (
    <OverlaysProvider>
        <Menu style={{ width: "200px" }} {...args} />
    </OverlaysProvider>
);

export const Default = MenuExample.bind({});
Default.args = {
    children: (
        <>
            {ContentMenuStory.args.children}
            <MenuDivider title="Second menu part" />
            <MenuItem {...MenuItemStory.args} active />
        </>
    ),
};
