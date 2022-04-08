import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import SimpleDialog from "./../SimpleDialog";
import storyModal from "./Modal.stories";
import { Default as CardContentExample } from "./../../Card/stories/CardContent.stories";
import { Default as CardActionsExample } from "./../../Card/stories/CardActions.stories";
import { Default as CardOptionExample } from "./../../Card/stories/CardOptions.stories";

export default {
    title: "Components/Dialog/SimpleDialog",
    component: SimpleDialog,
    argTypes: {
        ...storyModal.argTypes,
        headerOptions: {
            control: "none",
        },
        actions: {
            control: "none",
        }
    },
} as ComponentMeta<typeof SimpleDialog>;

const Template: ComponentStory<typeof SimpleDialog> = (args) => (
    <div style={{height: "400px"}}>
        <SimpleDialog {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {
    title: "SimpleDialog example title",
    headerOptions: CardOptionExample.args.children,
    children: CardContentExample.args.children,
    actions: CardActionsExample.args.children,
    hasBorder: true,
    isOpen: true,
    usePortal: false,
};
