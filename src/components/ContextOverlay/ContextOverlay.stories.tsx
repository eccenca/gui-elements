import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { PopoverInteractionKind, PopperModifierOverrides } from "@blueprintjs/core";
import { PopperPlacements } from "@blueprintjs/core";
import { OverlaysProvider } from "@blueprintjs/core";
import { Meta, StoryFn } from "@storybook/react";
import { fn } from "@storybook/test";

import { Button, ContextOverlay, HtmlContentBlock } from "../../index";

const interactionKindOptions = { UNDEFINED: undefined, ...PopoverInteractionKind };
const rootBoundaryOptions = { UNDEFINED: undefined, VIEWPORT: "viewport", DOCUMENT: "document" };
const positioningStrategyOptions = { UNDEFINED: undefined, ABSOLUTE: "absolute", FIXED: "fixed" };

export default {
    title: "Components/ContextOverlay",
    component: ContextOverlay,
    argTypes: {
        interactionKind: {
            options: Object.keys(interactionKindOptions),
            mapping: interactionKindOptions,
        },
        placement: {
            options: PopperPlacements,
        },
        rootBoundary: {
            options: Object.keys(rootBoundaryOptions),
            mapping: rootBoundaryOptions,
        },
        positioningStrategy: {
            options: Object.keys(positioningStrategyOptions),
            mapping: positioningStrategyOptions,
        },
    },
} as Meta<typeof ContextOverlay>;

let forcedUpdateKey = 0;
const Template: StoryFn<typeof ContextOverlay> = (args) => (
    <OverlaysProvider>
        <ContextOverlay {...args} key={++forcedUpdateKey} />
    </OverlaysProvider>
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
    onOpening: fn(),
    onInteraction: fn(),
};
