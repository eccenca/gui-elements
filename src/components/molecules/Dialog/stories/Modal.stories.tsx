import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { fn } from "storybook/test";

import { SimpleCard } from "@/components/molecules/Card/stories/Card.stories";

import { Card, Modal } from "@/components";

export default {
    title: "Components/Dialog/Modal",
    component: Modal,
    argTypes: {
        children: {
            control: false,
        },
    },
    decorators: [
        (Story) => (
            <div style={{ height: "400px", position: "relative" }}>
                <Story />
            </div>
        ),
    ],
} as Meta<typeof Modal>;

const Template: StoryFn<typeof Modal> = (args) => <Modal {...args} />;

export const Default = Template.bind({});
Default.args = {
    isOpen: true,
    usePortal: false,
    children: <Card {...SimpleCard.args} />,
    onOpening: fn(),
    onClosing: fn(),
};
