import React from "react";
import { LogoReact } from "@carbon/icons-react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

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
} as ComponentMeta<typeof TestIcon>;

const Template: ComponentStory<typeof TestIcon> = (args) => <TestIcon {...args} />;

export const TestingAnIcon = Template.bind({});
TestingAnIcon.args = {
    tryout: LogoReact,
};
