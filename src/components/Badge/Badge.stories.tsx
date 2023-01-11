import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Badge } from "../../../index";
import { helpersArgTypes } from "../../../.storybook/helpers";

export default {
    title: "Components/Badge",
    component: Badge,
    argTypes: {
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
