import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Modal, Card } from "./../../../../index";
import { SimpleCard } from "../../Card/stories/Card.stories";

export default {
    title: "Components/Dialog/Modal",
    component: Modal,
    argTypes: {
        children: {
            control: "none",
            description: "Elements to include into the modal container."
        }
    },
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => (
    <div style={{height: "400px"}}>
        <Modal {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {
    isOpen: true,
    usePortal: false,
    children: <Card {...SimpleCard.args} />
};
