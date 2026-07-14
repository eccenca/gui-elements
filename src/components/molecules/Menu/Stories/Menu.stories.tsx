import React from "react";
// Blueprint removed: inert passthrough (the former OverlaysProvider context is no longer needed)
const OverlaysProvider = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
import { Meta, StoryFn } from "@storybook/react";

import { Menu, MenuDivider, MenuItem } from "@/index";
import { Default as ContentMenuStory } from "@/components/molecules/ContextOverlay/ContextMenu.stories";
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
