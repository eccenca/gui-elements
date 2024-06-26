import React from "react";
import { OverlaysProvider } from "@blueprintjs/core";
import { Meta, StoryFn } from "@storybook/react";

import { Button, Icon } from "../../../../index";
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
    <OverlaysProvider>
        <Icon tooltipText={args.name?.toString()} {...args} />
    </OverlaysProvider>
);

export const Default = Template.bind({});
Default.args = {
    name: "undefined",
};

const TemplateSizes: StoryFn<typeof Icon> = (args) => (
    <OverlaysProvider>
        <Icon {...args} small />
        <Icon {...args} />
        <Icon {...args} large />
    </OverlaysProvider>
);

export const IconSizes = TemplateSizes.bind({});
IconSizes.args = {
    name: "undefined",
};

export const IconsOverview = () => {
    return (
        <OverlaysProvider>
            {Object.keys(canonicalIcons).map((iconName) => {
                return <Button icon={iconName as ValidIconName} outlined large tooltip={iconName} key={iconName} />;
            })}
        </OverlaysProvider>
    );
};
