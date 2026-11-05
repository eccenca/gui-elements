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

/**
 * Use `role="navigation"` for a list of links, e.g. as main or sidebar navigation.
 * The `MenuItem` elements get `roleStructure="listitem"` automatically.
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
        <MenuItem key="1" text="Dashboard" icon="application-homepage" href="#dashboard" active aria-current="page" />,
        <MenuItem key="2" text="Projects" icon="artefact-project" href="#projects" />,
        <MenuItem key="3" text="Datasets" icon="artefact-dataset" href="#datasets" />,
        <MenuItem key="4" text="Settings" icon="application-useraccount" href="#settings" />,
    ],
};
