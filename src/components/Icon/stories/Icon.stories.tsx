import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { ApplicationContainer, Button, Icon } from "../../../../index";
import { Definitions } from "../../../common/Intent";

import canonicalIcons, { ValidIconName } from "./../canonicalIconNames";

export default {
    title: "Components/Icon",
    component: Icon,
    argTypes: {
        name: {
            control: "select",
            options: [...Object.keys(canonicalIcons)],
        },
        intent: {
            control: "select",
            options: { ...Definitions },
        },
    },
} as Meta<typeof Icon>;

const Template: StoryFn<typeof Icon> = (args) => (
    <ApplicationContainer>
        <Icon {...args} tooltipText={args.name?.toString()} />
    </ApplicationContainer>
);

export const Default = Template.bind({});
Default.args = {
    name: "undefined",
};

const TemplateSizes: StoryFn<typeof Icon> = (args) => (
    <ApplicationContainer>
        <Icon {...args} small />
        <Icon {...args} />
        <Icon {...args} large />
    </ApplicationContainer>
);

export const IconSizes = TemplateSizes.bind({});
IconSizes.args = {
    name: "undefined",
};

export const IconsOverview = () => {
    return (
        <ApplicationContainer>
            {Object.keys(canonicalIcons).map((iconName) => {
                return <Button icon={iconName as ValidIconName} outlined large tooltip={iconName} key={iconName} />;
            })}
        </ApplicationContainer>
    );
};
