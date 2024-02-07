import React from "react";
import { LogoReact } from "@carbon/icons-react";
import { Meta, StoryFn } from "@storybook/react";

import { Definitions } from "../../../common/Intent";
import { TestIcon } from "../../../index";

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

const Template: StoryFn<typeof TestIcon> = (args) => <TestIcon {...args} />;

export const TestingAnIcon = Template.bind({});
TestingAnIcon.args = {
    tryout: LogoReact,
};
