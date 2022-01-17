import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Tag from "./Tag";
import { helpersArgTypes } from "../../../.storybook/helpers";

export default {
    title: "Components/Tag",
    component: Tag,
    argTypes: {
        icon: {
            description: "Icon element to render before the children.",
            ...helpersArgTypes.exampleIcon,
        },
        backgroundColor: {
            control: "color",
        },
        minimal: {
            description: "Whether this tag should use minimal (lighter) styles. **Important:** We use this internally as default, so you need to set it explicitely to `false` if necessary.",
            control: "boolean",
        },
        onClick: {
            description: "Callback invoked when the tag is clicked.",
            ...helpersArgTypes.handlerOnClick,
        },
        onRemove: {
            description: "Click handler for remove button. The remove button will only be rendered if this prop is defined.",
            ...helpersArgTypes.handlerOnClick,
        },
        emphasized: { control: "none" },
    },
} as ComponentMeta<typeof Tag>;

const Template: ComponentStory<typeof Tag> = (args) => (
  <Tag {...args}>Tag label</Tag>
);

export const Default = Template.bind({});
Default.args = {
  small: false,
};
