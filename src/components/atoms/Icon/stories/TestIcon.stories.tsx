import React from "react";
// Blueprint removed: inert passthrough (the former OverlaysProvider context is no longer needed)
const OverlaysProvider = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
import { Meta, StoryFn } from "@storybook/react";
import { Rocket } from "lucide-react";

import { Definitions } from "@/common/Intent";

import { TestIcon } from "../TestIcon";

export default {
    title: "Components/Icon/TestIcon",
    component: TestIcon,
    argTypes: {
        tryout: {
            control: "none",
        },
        intent: {
            control: "select",
            options: { ...Definitions },
        },
    },
} as Meta<typeof TestIcon>;

const Template: StoryFn<typeof TestIcon> = (args) => (
    <OverlaysProvider>
        <TestIcon {...args} />
    </OverlaysProvider>
);

export const TestingAnIcon = Template.bind({});
TestingAnIcon.args = {
    tryout: Rocket,
};
