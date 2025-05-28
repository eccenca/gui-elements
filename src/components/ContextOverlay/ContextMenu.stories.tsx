import React from "react";
import { OverlaysProvider } from "@blueprintjs/core";
import { Meta, StoryFn } from "@storybook/react";

import { ContextMenu, MenuItem } from "../../index";

export default {
    title: "Components/ContextMenu",
    component: ContextMenu,
    subcomponents: { MenuItem },
    argTypes: {
        children: {
            control: false,
        },
    },
} as Meta<typeof ContextMenu>;

const Template: StoryFn<typeof ContextMenu> = (args) => (
    <OverlaysProvider>
        <ContextMenu {...args} />
    </OverlaysProvider>
);

export const Default = Template.bind({});
Default.args = {
    children: [
        <MenuItem key="m0" text={"First option"} />,
        <MenuItem key="m1" text={"Item two"}>
            <MenuItem key="m2" text={"First sub option"} />
            <MenuItem key="m3" text={"Sub item two"} />
        </MenuItem>,
    ],
};
