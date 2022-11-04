import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TextField from "./../TextField";
import { helpersArgTypes } from "../../../../.storybook/helpers";

export default {
    title: "Forms/TextField",
    component: TextField,
    argTypes: {
        className: {
            description: "A space-delimited list of class names.",
            control: "boolean",
            table: {
                defaultValue: { summary: undefined },
                type: { summary: "string" },
            }
        },
        value: {
            description: "Form value of the input, for controlled usage.",
            control: "text",
            table: {
                defaultValue: { summary: undefined },
                type: { summary: "string" },
            }
        },
        type: {
            description: "HTML `input` type attribute.",
            control: "text",
            table: {
                defaultValue: { summary: "text" },
                type: { summary: "string" },
            }
        },
        placeholder: {
            description: "Placeholder text in the absence of any value.",
            control: "text",
            table: {
                defaultValue: { summary: undefined },
                type: { summary: "string" },
            }
        },
        disabled: {
            description: "Whether this action is non-interactive and the button is not usable.",
            control: "boolean",
            table: {
                defaultValue: { summary: false },
                type: { summary: "boolean" },
            }
        },
        leftIcon: {
            ...helpersArgTypes.exampleIcon,
            description: "Left aligned icon, can be a canonical icon name or an `Icon` element.",
        },
        rightElement: {
            ...helpersArgTypes.exampleIcon,
            description: "Right aligned element, mainly provided for user-interaction elements, e.g. minimal buttons, spinners, or tags.",
            //control: { disable: true, },
            table: {
                defaultValue: { summary: undefined },
                type: { summary: "JSX.Element" },
            }
        },
        onChange: {
            description: "Change event handler. Use `event.target.value` for new value.",
            table: {
                defaultValue: { summary: undefined },
                type: { summary: "React.FormEventHandler<HTMLElement>" },
            }
        },
        large: {
            description: "Whether this input should use large styles.",
            control: "boolean",
            table: {
                defaultValue: { summary: false },
                type: { summary: "boolean" },
            }
        },
        small: {
            description: "Whether this input should use small styles",
            control: "boolean",
            table: {
                defaultValue: { summary: false },
                type: { summary: "boolean" },
            }
        },
    },
} as ComponentMeta<typeof TextField>;

const Template: ComponentStory<typeof TextField> = (args) => (
    <TextField {...args}></TextField>
);

export const Default = Template.bind({});

Default.args = {
    fullWidth: false,
    placeholder: "placeholder text",
    readOnly: false,
};
