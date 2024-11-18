import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { WhiteSpaceContainer } from "../../../index";

import { Default as HtmlContentBlockStrory } from "./HtmlContentBlock.stories";

const whiteSpaceSizeOptions = {
    control: { type: "select" },
    options: ["not set", "tiny", "small", "regular", "large", "xlarge"],
    mapping: {
        "not set": undefined,
    },
};

export default {
    title: "Components/Typography/WhiteSpaceContainer",
    component: WhiteSpaceContainer,
    argTypes: {
        children: { control: false },
        marginTop: { ...whiteSpaceSizeOptions },
        marginRight: { ...whiteSpaceSizeOptions },
        marginBottom: { ...whiteSpaceSizeOptions },
        marginLeft: { ...whiteSpaceSizeOptions },
        paddingTop: { ...whiteSpaceSizeOptions },
        paddingRight: { ...whiteSpaceSizeOptions },
        paddingBottom: { ...whiteSpaceSizeOptions },
        paddingLeft: { ...whiteSpaceSizeOptions },
    },
} as Meta<typeof WhiteSpaceContainer>;

const Template: StoryFn<typeof WhiteSpaceContainer> = (args) => (
    <WhiteSpaceContainer {...args} style={{ background: "#eee" }} />
);

export const Default = Template.bind({});
Default.args = {
    children: HtmlContentBlockStrory.args.children,
    paddingTop: "tiny",
    paddingRight: "small",
    paddingBottom: "regular",
    paddingLeft: "large",
};
