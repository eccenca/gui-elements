import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Badge, Icon } from "../../../index";
import { helpersArgTypes } from "../../../.storybook/helpers";

export default {
    title: "Components/Badge",
    component: Badge,
    argTypes: {
        children: {
            control: "select",
            options: ["Number", "Text", "Icon"],
            mapping: {
                "Number": 123123,
                "Text": "Label text",
                "Icon": <Icon name="item-viewdetails" />
            },
        },
        intent: {
            ...helpersArgTypes.exampleIntent,
        },
    },
} as ComponentMeta<typeof Badge>;

const TemplateFull: ComponentStory<typeof Badge> = (args) => (
    <div style={{position: "relative", border: "solid 1px", width: "10rem"}}>
        Element area
        {" "}
        <Badge {...args} />
    </div>
);

export const FullExample = TemplateFull.bind({});
FullExample.args = {
    children: "123"
};

export const WithTitletip = TemplateFull.bind({});
WithTitletip.args = {
    position: "bottom-right",
    children: 1000,
    maxLength: 3,
    intent: "info",
    tagProps: {htmlTitle: "1000 messages available"},
}
