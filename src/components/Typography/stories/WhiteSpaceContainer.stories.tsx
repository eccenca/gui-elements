import React from "react";
import { loremIpsum } from "react-lorem-ipsum";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { WhiteSpaceContainer as WhiteSpaceContainerElement } from "../../../index";

const whiteSpaceSizeOptions = {
    control: "select",
    options: {
        "not set": undefined,
        tiny: "tiny",
        small: "small",
        regular: "regular",
        large: "large",
        xlarge: "xlarge",
    },
};

export default {
    title: "Components/Typography",
    component: WhiteSpaceContainerElement,
    argTypes: {
        children: { control: "none" },
        marginTop: { ...whiteSpaceSizeOptions },
        marginRight: { ...whiteSpaceSizeOptions },
        marginBottom: { ...whiteSpaceSizeOptions },
        marginLeft: { ...whiteSpaceSizeOptions },
        paddingTop: { ...whiteSpaceSizeOptions },
        paddingRight: { ...whiteSpaceSizeOptions },
        paddingBottom: { ...whiteSpaceSizeOptions },
        paddingLeft: { ...whiteSpaceSizeOptions },
    },
} as ComponentMeta<typeof WhiteSpaceContainerElement>;

const Template: ComponentStory<typeof WhiteSpaceContainerElement> = (args) => (
    <WhiteSpaceContainerElement {...args} style={{ background: "#eee" }} />
);

const testContent = loremIpsum({
    p: 2,
    avgSentencesPerParagraph: 4,
    random: false,
}).toString();

export const WhiteSpaceContainer = Template.bind({});
WhiteSpaceContainer.args = {
    children: [
        <p>{testContent}</p>,
        <p>
            <strong>{testContent.replaceAll(" ", "")}</strong>
        </p>,
        <p>{testContent}</p>,
    ],
    paddingTop: "tiny",
    paddingRight: "small",
    paddingBottom: "regular",
    paddingLeft: "large",
};
