import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

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
    },
} as ComponentMeta<typeof Button>;

const TemplateFull: ComponentStory<typeof Button> = (args) => <Button {...args} />;

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
        <Button {...args} text={undefined}>
            Children label
        </Button>
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
