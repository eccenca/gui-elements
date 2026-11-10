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
    role: "menu",
    children: (
        <>
            {ContentMenuStory.args.children}
            <MenuDivider role="separator" title="Second menu part" />
            <MenuItem {...MenuItemStory.args} active />
        </>
    ),
};

/**
 * Use `role="navigation"` for a list of links, e.g. as main or sidebar navigation.
 * The `MenuItem` elements need `roleStructure="listitem"`, it is set automatically if missing.
 * `MenuDivider` elements need `role="listitem"` because `separator` is not allowed inside a list,
 * it is set automatically if missing. Dividers without `title` get `aria-hidden` automatically.
 * `Menu` does not add a `nav` element, so you need to wrap it on your own.
 */
const NavigationExample: StoryFn<typeof Menu> = (args) => (
    <OverlaysProvider>
        <nav aria-label="Main navigation">
            <Menu style={{ width: "200px" }} {...args} />
        </nav>
    </OverlaysProvider>
);

export const Navigation = NavigationExample.bind({});
Navigation.args = {
    role: "navigation",
    children: [
        <MenuItem
            key="1"
            roleStructure="listitem"
            text="Dashboard"
            icon="application-homepage"
            href="#dashboard"
            active
            aria-current="page"
        />,
        <MenuItem key="2" roleStructure="listitem" text="Projects" icon="artefact-project" href="#projects" />,
        <MenuItem key="3" roleStructure="listitem" text="Datasets" icon="artefact-dataset" href="#datasets" />,
        <MenuDivider key="d1" role="listitem" />,
        <MenuItem key="4" roleStructure="listitem" text="Settings" icon="application-useraccount" href="#settings" />,
    ],
};
