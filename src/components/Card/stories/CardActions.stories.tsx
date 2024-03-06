import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import Button from "../../Button/Button";
import { CardActions, CardActionsAux } from "../index";

import { Default as CardOptionsExample } from "./CardOptions.stories";
import { Default as CardTitleExample } from "./CardTitle.stories";

export default {
    title: "Components/Card/CardActions",
    component: CardActions,
    subcomponents: {
        CardActionsAux,
    },
    argTypes: {
        children: {
            control: "none",
            description: "Elements to include into the actions container.",
        },
    },
} as ComponentMeta<typeof CardActions>;

const Template: ComponentStory<typeof CardActions> = (args) => <CardActions {...args} />;

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
