import React from "react";
import { LogoReact } from "@carbon/icons-react";
import { Meta, StoryFn } from "@storybook/react";

import { helpersArgTypes } from "../../../.storybook/helpers";
import { Badge, Icon, TestIcon } from "../../../index";

export default {
    title: "Components/Badge",
    component: Badge,
    argTypes: {
        children: {
            control: "select",
            options: ["Number", "Text", "Named icon", "Test icon"],
            mapping: {
                Number: 123123,
                Text: "Label text",
                "Named icon": <Icon name="item-viewdetails" />,
                "Test icon": <TestIcon tryout={LogoReact} />,
            },
        },
        intent: {
            ...helpersArgTypes.exampleIntent,
        },
    },
} as Meta<typeof Badge>;

const TemplateFull: StoryFn<typeof Badge> = (args) => (
    <div style={{ position: "relative", border: "solid 1px", width: "10rem" }}>
        Element area <Badge {...args} />
    </div>
);

export const FullExample = TemplateFull.bind({});
FullExample.args = {
    children: "123",
};

export const WithTitletip = TemplateFull.bind({});
WithTitletip.args = {
    position: "bottom-right",
    children: 1000,
    maxLength: 3,
    intent: "info",
    tagProps: { htmlTitle: "1000 messages available" },
};
