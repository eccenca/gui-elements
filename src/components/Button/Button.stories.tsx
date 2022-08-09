import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Button from "./Button";
import Icon from "../Icon/Icon";
import Spacing from "../Separation/Spacing";

export default {
    title: "Components/Button",
    component: Button,
    argTypes: {
        active: {
            description: "Button will display in an active state.",
            control: "boolean",
            table: {
                defaultValue: { summary: false },
                type: { summary: "boolean" },
            }
        },
        className: {
            description: "A space-delimited list of class names.",
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
        minimal: {
            description: "Whether this button should use minimal styles.",
            control: "boolean",
            table: {
                defaultValue: { summary: false },
                type: { summary: "boolean" },
            }
        },
        outlined: {
            description: "Whether this button should use outlined styles.",
            control: "boolean",
            table: {
                defaultValue: { summary: false },
                type: { summary: "boolean" },
            }
        },
        text: {
            description: "Action text. Can be any single React renderable. Can be used as alternative to include `children` elements.",
            control: "text",
            table: {
                defaultValue: { summary: undefined },
                type: { summary: "React.ReactNode" },
            }
        },
        type: {
            description: "HTML type attribute of button. Note that this prop has no effect on buttons with `href` property set.",
            control: "text",
            table: {
                defaultValue: { summary: "button" },
                type: { summary: "button | reset | submit" },
            }
        },
        loading: {
            description: "Button is displayed disabled and contains a spinner instead of its contents.",
            control: "boolean",
            table: {
                defaultValue: { summary: false },
                type: { summary: "boolean" },
            }
        },
        fill: {
            description: "Whether this button should expand to fill its container.",
            control: "boolean",
            table: {
                defaultValue: { summary: false },
                type: { summary: "boolean" },
            }
        },
        large: {
            description: "Whether this button should use large styles.",
            control: "boolean",
            table: {
                defaultValue: { summary: false },
                type: { summary: "boolean" },
            }
        },
        small: {
            description: "Whether this button should use small styles",
            control: "boolean",
            table: {
                defaultValue: { summary: false },
                type: { summary: "boolean" },
            }
        },
        icon: {
            description: "Left aligned icon, can be a canonical icon name or an `Icon` element.",
            control: { disable: true, },
            table: {
                defaultValue: { summary: undefined },
                type: { summary: "Icon | string" },
            }
        },
        rightIcon: {
            description: "Right aligned icon, can be a canonical icon name or an `Icon` element.",
            control: { disable: true, },
            table: {
                defaultValue: { summary: undefined },
                type: { summary: "Icon | string" },
            }
        },
        onClick: {
            description: "Click event handler.",
            action: "clicked",
            table: {
                defaultValue: { summary: undefined },
                type: { summary: "(event: MouseEvent<HTMLElement>) => void" },
            }
        },
    },
} as ComponentMeta<typeof Button>;

const TemplateFull: ComponentStory<typeof Button> = (args) => (
    <Button {...args} />
);

export const FullExample = TemplateFull.bind({});
FullExample.args = {
    hasStatePrimary: false,
    hasStateSuccess: false,
    hasStateWarning: false,
    hasStateDanger: false,
    elevated: false,
    affirmative: false,
    disruptive: false,
    tooltip: "Example tooltip",
    loading: false,
    text: "Button label",
};

FullExample.parameters = {
    jest: "Button.test.tsx",
};

const TemplateIcons: ComponentStory<typeof Button> = (args) => (
    <>
        <Button {...args} icon={"item-viewdetails"} />
        <Spacing vertical />
        <Button {...args} rightIcon={<Icon name={"item-download"} />} />
    </>
);
export const ButtonsWithIcon = TemplateIcons.bind({});
ButtonsWithIcon.args = FullExample.args;

const TemplateSemantic: ComponentStory<typeof Button> = (args) => (
    <>
        <Button {...args} text="Normal action" />
        <Spacing vertical />
        <Button {...args} affirmative text="Affirmative action" />
        <Spacing vertical />
        <Button {...args} disruptive text="Disruptive action" />
    </>
);
export const ButtonSemantics = TemplateSemantic.bind({});
ButtonSemantics.args = FullExample.args;

const TemplateState: ComponentStory<typeof Button> = (args) => (
    <>
        <Button {...args} text="Success" hasStateSuccess />
        <Spacing vertical />
        <Button {...args} text="Warning" hasStateWarning />
        <Spacing vertical />
        <Button {...args} text="Danger" hasStateDanger />
    </>
);
export const ButtonStates = TemplateState.bind({});
ButtonStates.args = FullExample.args;

const TemplateContent: ComponentStory<typeof Button> = (args) => (
    <>
        <Button {...args} text="Property label" />
        <Spacing vertical />
        <Button {...args} text={undefined}>Children label</Button>
    </>
);
export const ButtonLabels = TemplateContent.bind({});
ButtonLabels.args = FullExample.args;

const TemplateAnchor: ComponentStory<typeof Button> = (args) => (
    <>
        <Button {...args} text="Example link" href="https://eccenca.com/" target="_new" />
    </>
);
export const LinkButton = TemplateAnchor.bind({});
LinkButton.args = FullExample.args;



