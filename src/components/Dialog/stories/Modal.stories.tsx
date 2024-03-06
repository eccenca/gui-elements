import React from "react";
import { OverlaysProvider } from "@blueprintjs/core";
import { Meta, StoryFn } from "@storybook/react";

import { SimpleCard } from "../../Card/stories/Card.stories";

import { Card, Modal } from "./../../../../index";

export default {
    title: "Components/Dialog/Modal",
    component: Modal,
    argTypes: {
        children: {
            control: "none",
            description: "Elements to include into the modal container.",
        },
    },
} as Meta<typeof Modal>;

const Template: StoryFn<typeof Modal> = (args) => (
    <OverlaysProvider>
        <div style={{ height: "400px" }}>
            <Modal {...args} />
        </div>
    </OverlaysProvider>
);

export const Default = Template.bind({});
Default.args = {
    isOpen: true,
    usePortal: false,
    children: <Card {...SimpleCard.args} />,
};
