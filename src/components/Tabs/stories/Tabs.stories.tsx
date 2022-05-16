import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Tabs, Tab, TabTitle } from "./../../../";

export default {
    title: "Components/Tabs",
    component: Tabs,
    argTypes: {
        id: {
            description: "Unique identifier used to control which tab is selected.",
            control: "text",
            table: {
                type: { summary: "string" },
            }
        },
        className: {
            description: "A space-delimited list of class names.",
            control: "text",
            table: {
                defaultValue: { summary: undefined },
                type: { summary: "string" },
            }
        },
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
        defaultSelectedTabId: {
            description: "Initial selected tab `id`, for uncontrolled usage.",
            control: "text",
            table: {
                defaultValue: { summary: undefined },
                type: { summary: "string" },
            }
        },
        selectedTabId: {
            description: "Selected tab id, for controlled usage. Providing this prop will put the component in controlled mode and the `onChange` handler must be set.",
            control: "text",
            table: {
                defaultValue: { summary: undefined },
                type: { summary: "string" },
            }
        },
        onChange: {
            description: "A callback function that is invoked when a tab in the tab list is clicked.",
            table: {
                defaultValue: { summary: undefined },
                type: { summary: "(newTabId: TabId, prevTabId: TabId | undefined, event: MouseEvent<HTMLElement>) => void" },
            }
        },
    },
} as ComponentMeta<typeof Tabs>;

const TemplateFull: ComponentStory<typeof Tabs> = (args) => (
    <Tabs {...args} />
);

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
        }
    ]
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
