import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { fn } from "storybook/test";

import IframeModal from "./IframeModal";

export default {
    title: "Components/Iframe/IframeModal",
    component: IframeModal,
    argTypes: {
        children: {
            control: false,
        },
    },
} as Meta<typeof IframeModal>;

const Template: StoryFn<typeof IframeModal> = (args) => (
    <div style={{ height: "400px", position: "relative" }}>
        <IframeModal {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {
    title: "Example iframe modal",
    src: "about:blank",
    isOpen: true,
    usePortal: false,
    onOpening: fn(),
    onClosing: fn(),
};
