import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { DecoupledOverlay, DecoupledOverlayProps, Tag, WhiteSpaceContainer } from "../../../index";

export default {
    title: "Components/DecoupledOverlay",
    component: DecoupledOverlay,
    argTypes: {},
} as Meta<typeof DecoupledOverlay>;

const Template: StoryFn<typeof DecoupledOverlay> = (args: DecoupledOverlayProps) => {
    return (
        <>
            <Tag id={"decoupledTarget"}>Decoupled target</Tag>
            <DecoupledOverlay {...args} />
        </>
    );
};

export const Default = Template.bind({});

Default.args = {
    children: (
        <WhiteSpaceContainer marginTop={"small"} marginRight={"small"} marginBottom={"small"} marginLeft={"small"}>
            Decoupled overlay
        </WhiteSpaceContainer>
    ),
    targetSelectorOrElement: "#decoupledTarget",
};
