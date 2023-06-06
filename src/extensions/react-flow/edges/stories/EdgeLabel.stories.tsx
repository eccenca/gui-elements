import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { loremIpsum } from 'react-lorem-ipsum';
import { EdgeLabel, IconButton, Badge, Icon, OverflowText } from "./../../../../../index";
import canonicalIcons from "./../../../../components/Icon/canonicalIconNames";
import { helpersArgTypes } from "../../../../../.storybook/helpers";

export default {
    title: "Extensions/React Flow/Custom EdgeLabel",
    component: EdgeLabel,
    argTypes: {
        depiction: {
            control: "select",
            options: [...(Object.keys(canonicalIcons))],
        },
        actions: {
            control: "select",
            options: ["Not set", "Icon button", "Icon button small", "Info badge", "Icon badge"],
            mapping: {
                "Not set": undefined,
                "Icon button": <IconButton name="item-info" text="Icon button" onClick={()=>alert("Click info")} />,
                "Icon button small": <IconButton small name="item-info" text="Icon button" onClick={()=>alert("Click info")} />,
                "Info badge": <Badge intent="info">Info</Badge>,
                "Icon badge": <Badge intent="accent" size="small"><Icon name="undefined" small /></Badge>,
            },
        },
        intent: {
            ...helpersArgTypes.exampleIntent,
        },
    },
} as ComponentMeta<typeof EdgeLabel>;

const Template: ComponentStory<typeof EdgeLabel> = (args) => (
    <EdgeLabel {...args} />
);

const labelText = loremIpsum({ p: 1, avgSentencesPerParagraph: 1, avgWordsPerSentence: 8, random: false }).toString()

export const Default = Template.bind({});
Default.args = {
    text: labelText,
};

export const ReverseEllipsisLabel = Template.bind({});
ReverseEllipsisLabel.args = {
    text: <OverflowText ellipsis="reverse">{labelText}</OverflowText>,
    title: labelText,
}
