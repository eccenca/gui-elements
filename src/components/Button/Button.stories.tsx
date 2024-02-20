import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { helpersArgTypes } from "../../../.storybook/helpers";
import { ApplicationContainer, Button, Icon, Spacing } from "../../../index";

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
    },
} as Meta<typeof Button>;

const TemplateFull: StoryFn<typeof Button> = (args) => (
    <ApplicationContainer>
        <Button {...args} />
    </ApplicationContainer>
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
    <ApplicationContainer>
        <Button {...args} icon={"item-viewdetails"} />
        <Spacing vertical />
        <Button {...args} rightIcon={<Icon name={"item-download"} />} />
    </ApplicationContainer>
);
export const ButtonsWithIcon = TemplateIcons.bind({});
ButtonsWithIcon.args = FullExample.args;

const TemplateSemantic: StoryFn<typeof Button> = (args) => (
    <ApplicationContainer>
        <Button {...args} text="Normal action" />
        <Spacing vertical />
        <Button {...args} affirmative text="Affirmative action" />
        <Spacing vertical />
        <Button {...args} disruptive text="Disruptive action" />
    </ApplicationContainer>
);
export const ButtonSemantics = TemplateSemantic.bind({});
ButtonSemantics.args = FullExample.args;

const TemplateState: StoryFn<typeof Button> = (args) => (
    <ApplicationContainer>
        <Button {...args} text="Success" hasStateSuccess />
        <Spacing vertical />
        <Button {...args} text="Warning" hasStateWarning />
        <Spacing vertical />
        <Button {...args} text="Danger" hasStateDanger />
    </ApplicationContainer>
);
export const ButtonStates = TemplateState.bind({});
ButtonStates.args = FullExample.args;

const TemplateContent: StoryFn<typeof Button> = (args) => (
    <ApplicationContainer>
        <Button {...args} text="Property label" />
        <Spacing vertical />
        <Button {...args} text={undefined}>
            Children label
        </Button>
    </ApplicationContainer>
);
export const ButtonLabels = TemplateContent.bind({});
ButtonLabels.args = FullExample.args;

const TemplateAnchor: StoryFn<typeof Button> = (args) => (
    <ApplicationContainer>
        <Button {...args} text="Example link" href="https://eccenca.com/" target="_new" />
    </ApplicationContainer>
);
export const LinkButton = TemplateAnchor.bind({});
LinkButton.args = FullExample.args;
