import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { LogoReact } from "@carbon/icons-react";
import { TestIcon } from "../../../index";
import { Definitions } from "../../../common/Intent";

export default {
    title: "Components/Icon",
    component: TestIcon,
    argTypes: {
        tryout: {
            control: "none",
        },
        intent: {
            control: "select",
            options: {...Definitions},
        },
    },
} as ComponentMeta<typeof TestIcon>;

const Template: ComponentStory<typeof TestIcon> = (args) => (
    <TestIcon {...args} />
);

export const TestingAnIcon = Template.bind({});
TestingAnIcon.args = {
    tryout: LogoReact,
}
