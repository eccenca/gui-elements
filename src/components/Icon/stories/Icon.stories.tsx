import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import {
    Icon,
    Button,
} from "../../../index";
import canonicalIcons, { ValidIconName } from "./../canonicalIconNames";
import { Definitions } from "../../../common/Intent";

export default {
    title: "Components/Icon",
    component: Icon,
    argTypes: {
        name: {
            control: "select",
            options: [...(Object.keys(canonicalIcons))],
        },
        intent: {
            control: "select",
            options: {...Definitions},
        },
    },
} as ComponentMeta<typeof Icon>;

const Template: ComponentStory<typeof Icon> = (args) => (
    <Icon {...args} tooltipText={args.name?.toString()}/>
);

export const Default = Template.bind({});
Default.args = {
    name: "undefined"
}

export const IconsOverview = () => {
    return (
        <>
            {
                Object.keys(canonicalIcons).map((iconName) => {
                    return (
                        <Button
                            icon={iconName as ValidIconName}
                            outlined
                            large
                            tooltip={iconName}
                        />
                    )
                })
            }
        </>
    );
}
