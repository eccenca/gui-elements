import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { LogoReact } from "@carbon/icons-react";
import { Menu, MenuItem, TestIcon } from "../../../../index";
import canonicalIcons from "./../../Icon/canonicalIconNames";

export default {
    title: "Components/Menu/MenuItem",
    component: MenuItem,
    argTypes: {
        icon: {
            control: "select",
            options: [
            "Test icon",
                ...(Object.keys(canonicalIcons)),
            ],
            mapping: {
            "Test icon": <TestIcon tryout={LogoReact} className="testclass-icon"/>,
                ...(Object.keys(canonicalIcons)),
            }
        },
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
        <MenuItem key="m7" text={"Sub option 2"} />
        </>
    ),
    text: "Parent option",
    key: "m4"
};
