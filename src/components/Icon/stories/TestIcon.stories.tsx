import React from "react";
import { LogoReact } from "@carbon/icons-react";
import { Meta, StoryFn } from "@storybook/react";

import { ApplicationContainer, TestIcon } from "../../../../index";
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
    <ApplicationContainer>
        <TestIcon {...args} />
    </ApplicationContainer>
);

export const TestingAnIcon = Template.bind({});
TestingAnIcon.args = {
    tryout: LogoReact,
};
