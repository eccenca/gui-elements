import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { ApplicationContainer, Menu, MenuDivider, MenuItem } from "../../../../index";
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
    <ApplicationContainer>
        <Menu style={{ width: "200px" }} {...args} />
    </ApplicationContainer>
);

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
