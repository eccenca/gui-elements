import React from "react";
import { OverlaysProvider } from "@blueprintjs/core";
import { Meta, StoryFn } from "@storybook/react";

import { helpersArgTypes } from "../../../.storybook/helpers";
import { Button, Icon, Spacing } from "../../../index";

export default {
    title: "Components/Button",
    component: Button,
    argTypes: {
        icon: {
            ...helpersArgTypes.exampleIcon,
        },
        rightIcon: {
            ...helpersArgTypes.exampleIcon,
        },
        onClick: {
            action: "clicked",
        },
        intent: {
            ...helpersArgTypes.exampleIntent,
            options: ["UNDEFINED", "primary", "success", "warning", "danger"],
        },
    },
} as Meta<typeof Button>;

const TemplateFull: StoryFn<typeof Button> = (args) => (
    <OverlaysProvider>
        <Button {...args} />
    </OverlaysProvider>
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

const TemplateIcons: StoryFn<typeof Button> = (args) => (
    <OverlaysProvider>
        <Button {...args} icon={"item-viewdetails"} />
        <Spacing vertical />
        <Button {...args} rightIcon={<Icon name={"item-download"} />} />
    </OverlaysProvider>
);
export const ButtonsWithIcon = TemplateIcons.bind({});
ButtonsWithIcon.args = FullExample.args;

const TemplateSemantic: StoryFn<typeof Button> = (args) => (
    <OverlaysProvider>
        <Button {...args} text="Normal action" />
        <Spacing vertical />
        <Button {...args} affirmative text="Affirmative action" />
        <Spacing vertical />
        <Button {...args} disruptive text="Disruptive action" />
    </OverlaysProvider>
);
export const ButtonSemantics = TemplateSemantic.bind({});
ButtonSemantics.args = FullExample.args;

const TemplateIntent: StoryFn<typeof Button> = (args) => (
    <OverlaysProvider>
        <Button {...args} text="Success" intent="success" />
        <Spacing vertical />
        <Button {...args} text="Warning" intent="warning" />
        <Spacing vertical />
        <Button {...args} text="Danger" intent="danger" />
    </OverlaysProvider>
);
export const ButtonIntent = TemplateIntent.bind({});
ButtonIntent.args = FullExample.args;

const TemplateContent: StoryFn<typeof Button> = (args) => (
    <OverlaysProvider>
        <Button {...args} text="Property label" />
        <Spacing vertical />
        <Button {...args} text={undefined}>
            Children label
        </Button>
    </OverlaysProvider>
);
export const ButtonLabels = TemplateContent.bind({});
ButtonLabels.args = FullExample.args;

const TemplateAnchor: StoryFn<typeof Button> = (args) => (
    <OverlaysProvider>
        <Button {...args} text="Example link" href="https://eccenca.com/" target="_new" />
    </OverlaysProvider>
);
export const LinkButton = TemplateAnchor.bind({});
LinkButton.args = FullExample.args;
