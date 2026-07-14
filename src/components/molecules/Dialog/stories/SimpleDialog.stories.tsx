import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { fn } from "storybook/test";

import { SimpleDialog } from "@/index";
import { Default as CardActionsExample } from "@/components/molecules/Card/stories/CardActions.stories";
import { Default as CardContentExample } from "@/components/molecules/Card/stories/CardContent.stories";
import { Default as CardOptionExample } from "@/components/molecules/Card/stories/CardOptions.stories";
import storyModal from "./Modal.stories";

export default {
    title: "Components/Dialog/SimpleDialog",
    component: SimpleDialog,
    argTypes: {
        ...storyModal.argTypes,
        headerOptions: {
            control: false,
        },
        actions: {
            control: false,
        },
    },
} as Meta<typeof SimpleDialog>;

const Template: StoryFn<typeof SimpleDialog> = (args) => (
    <div style={{ height: "400px", position: "relative" }}>
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
    onOpening: fn(),
    onClosing: fn(),
};
