import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { SimpleCard } from "../../Card/stories/Card.stories";

import { ApplicationContainer, Card, Modal } from "./../../../../index";

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
    <ApplicationContainer>
        <div style={{ height: "400px" }}>
            <Modal {...args} />
        </div>
    </ApplicationContainer>
);

export const Default = Template.bind({});
Default.args = {
    isOpen: true,
    usePortal: false,
    children: <Card {...SimpleCard.args} />,
};
