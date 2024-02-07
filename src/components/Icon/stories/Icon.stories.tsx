import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { Definitions } from "../../../common/Intent";
import { Button, Icon } from "../../../index";

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

const Template: StoryFn<typeof Icon> = (args) => <Icon {...args} tooltipText={args.name?.toString()} />;

export const Default = Template.bind({});
Default.args = {
    name: "undefined",
};

const TemplateSizes: StoryFn<typeof Icon> = (args) => (
    <>
        <Icon {...args} small />
        <Icon {...args} />
        <Icon {...args} large />
    </>
);

export const IconSizes = TemplateSizes.bind({});
IconSizes.args = {
    name: "undefined",
};

export const IconsOverview = () => {
    return (
        <>
            {Object.keys(canonicalIcons).map((iconName) => {
                return <Button icon={iconName as ValidIconName} outlined large tooltip={iconName} />;
            })}
        </>
    );
};
