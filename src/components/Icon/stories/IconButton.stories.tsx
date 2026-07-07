import React from "react";
// Blueprint removed: inert passthrough (the former OverlaysProvider context is no longer needed)
const OverlaysProvider = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
import { Rocket } from "lucide-react";
import { Meta, StoryFn } from "@storybook/react";

import { IconButton, TestIcon } from "../../../components";

import buttonStory from "./../../Button/Button.stories";
import canonicalIcons from "./../canonicalIconNames";

export default {
    title: "Components/IconButton",
    component: IconButton,
    argTypes: {
        name: {
            control: "select",
            options: ["Test icon", ...Object.keys(canonicalIcons)],
            mapping: {
                "Test icon": <TestIcon tryout={Rocket} className="testclass-icon" />,
                ...Object.keys(canonicalIcons),
            },
        },
        intent: buttonStory.argTypes?.intent,
    },
} as Meta<typeof IconButton>;

const Template: StoryFn<typeof IconButton> = (args) => (
    <OverlaysProvider>
        <IconButton {...args} />
    </OverlaysProvider>
);

export const Default = Template.bind({});
Default.args = {
    name: "item-moremenu",
    text: "Tooltip text",
};
