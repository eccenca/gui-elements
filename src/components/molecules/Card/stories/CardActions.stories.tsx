import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import Button from "@/components/atoms/Button/Button";

import { CardActions, CardActionsAux } from "../index";

export default {
    title: "Components/Card/CardActions",
    component: CardActions,
    subcomponents: {
        CardActionsAux,
    },
    argTypes: {
        children: {
            control: { disable: true },
            description: "Elements to include into the actions container.",
        },
    },
} as Meta<typeof CardActions>;

const Template: StoryFn<typeof CardActions> = (args) => <CardActions {...args} />;

export const Default = Template.bind({});
Default.args = {
    children: [
        <Button affirmative key={"1"}>
            Main action
        </Button>,
        <Button key={"2"}>Cancel</Button>,
        <CardActionsAux key={"3"}>
            <Button outlined>Other action</Button>
        </CardActionsAux>,
    ],
};
