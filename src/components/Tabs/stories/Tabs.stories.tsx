import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Tabs, TabTitle } from "./../../../";

export default {
    title: "Components/Tabs",
    component: Tabs,
    argTypes: {
        /*
        NOTE: we currently cannot support this because Blueprint set then !important
        styles prevent tab background colors.

        animate: {
            description: "Whether the selected tab indicator should animate its movement.",
            control: "boolean",
            table: {
                defaultValue: { summary: true },
                type: { summary: "boolean" },
            }
        },
        */
    },
} as ComponentMeta<typeof Tabs>;

const TemplateFull: ComponentStory<typeof Tabs> = (args) => <Tabs {...args} />;

export const TabsContainerUncontrolled = TemplateFull.bind({});
TabsContainerUncontrolled.args = {
    id: "storytabs1",
    tabs: [
        {
            id: "storytab1",
            title: "Tab title 1",
            panel: <div>Tab content 1</div>,
        },
        {
            id: "storytab2",
            title: <TabTitle text="Tab title 2" />,
            panel: <div>Tab content 2</div>,
        },
        {
            id: "storytab3",
            title: <TabTitle text="Tab title 3" tooltip="Tab tooltip 3" />,
            panel: <div>Tab content 3</div>,
        },
    ],
};

/*
FIXME: this integration does currently not work, reason is not clear. See Tab component comments at bottom.
export const UncontrolledElementsUsage = TemplateFull.bind({});
UncontrolledElementsUsage.args = {
    id: "storytabs2",
    children: [
        <Tab id="storytab1" title="Tab title 1" panel={<div>Tab content 1</div>} />
    ]
};
*/
