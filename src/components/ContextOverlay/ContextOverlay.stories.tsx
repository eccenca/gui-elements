import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { PopoverInteractionKind, PopperModifierOverrides } from "@blueprintjs/core";
import { PopperPlacements } from "@blueprintjs/core";
import { Meta, StoryFn } from "@storybook/react";

import { ApplicationContainer, Button, ContextOverlay, HtmlContentBlock } from "../../index";

export default {
    title: "Components/ContextOverlay",
    component: ContextOverlay,
    argTypes: {
        interactionKind: {
            options: { UNDEFINED: undefined, ...PopoverInteractionKind },
        },
        placement: {
            options: PopperPlacements,
        },
        rootBoundary: {
            options: { UNDEFINED: undefined, VIEWPORT: "viewport", DOCUMENT: "document" },
        },
        positioningStrategy: {
            options: { UNDEFINED: undefined, ABSOLUTE: "absolute", FIXED: "fixed" },
        },
    },
} as Meta<typeof ContextOverlay>;

const Template: StoryFn<typeof ContextOverlay> = (args) => (
    <ApplicationContainer>
        <ContextOverlay {...args} />
    </ApplicationContainer>
);

export const Default = Template.bind({});
Default.args = {
    children: <Button>Target</Button>,
    content: (
        <HtmlContentBlock style={{ maxWidth: "40em", padding: "0.5rem" }}>
            Overlay:
            <LoremIpsum p={2} avgSentencesPerParagraph={4} random={false} />
        </HtmlContentBlock>
    ),
    placement: "auto-start",
    usePortal: true,
    minimal: false,
    defaultIsOpen: false,
    modifiers: {
        flip: {
            enabled: true,
        },
        preventOverflow: {
            enabled: true,
        },
    } as PopperModifierOverrides,
    rootBoundary: "viewport",
    hasBackdrop: false,
};
