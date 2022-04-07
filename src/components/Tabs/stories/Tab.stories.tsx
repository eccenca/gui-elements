import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Tabs } from "./../../../../";
import { TabDummyForStorybook } from "./../Tab";

export default {
    title: "Components/Tabs",
    component: TabDummyForStorybook,
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
            control: "boolean",
            table: {
                defaultValue: { summary: undefined },
                type: { summary: "string" },
            }
        },
        disabled: {
            description: "Whether this action is non-interactive and the button is not usable. This option must be repeated currently also in the `TabTitle` element.",
            control: "boolean",
            table: {
                defaultValue: { summary: false },
                type: { summary: "boolean" },
            }
        },
        panel: {
            description: "Panel content, rendered by the parent Tabs when this tab is active.",
            table: {
                defaultValue: { summary: undefined },
                type: { summary: "JSX.Element" },
            }
        },
    },
} as ComponentMeta<typeof TabDummyForStorybook>;

const Tab = (args) => {
    return (
        <Tabs
            id="titledemo"
            tabs={[args]}
        />
    )
}

const TemplateFull: ComponentStory<typeof TabDummyForStorybook> = (args) => (
    <Tab {...args} />
);

export const TabElement = TemplateFull.bind({});
TabElement.args = {
    id: "tabtest",
    title: "Tab title",
    dontShrink: false,
    panel: <div>Test panel content.</div>
};
