import React from "react";
import { OverlaysProvider } from "@blueprintjs/core";
import { LogoReact } from "@carbon/icons-react";
import { Meta, StoryFn } from "@storybook/react";

import { TestIcon } from "../../../../index";
import { Definitions } from "../../../common/Intent";

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
    tryout: LogoReact,
};
