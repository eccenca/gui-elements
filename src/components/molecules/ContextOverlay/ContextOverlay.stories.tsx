import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";
import { fn } from "storybook/test";

import { Button, ContextOverlay, HtmlContentBlock } from "@/index";

import { ContextOverlayInteractionKind, ContextOverlayPlacement } from "./ContextOverlay";

const interactionKindOptions: Record<string, ContextOverlayInteractionKind | undefined> = {
    UNDEFINED: undefined,
    CLICK: "click",
    CLICK_TARGET_ONLY: "click-target",
    HOVER: "hover",
    HOVER_TARGET_ONLY: "hover-target",
};
const placementOptions: ContextOverlayPlacement[] = [
    "auto",
    "auto-start",
    "auto-end",
    "top",
    "top-start",
    "top-end",
    "right",
    "right-start",
    "right-end",
    "bottom",
    "bottom-start",
    "bottom-end",
    "left",
    "left-start",
    "left-end",
];

export default {
    title: "Components/ContextOverlay",
    component: ContextOverlay,
    argTypes: {
        interactionKind: {
            options: Object.keys(interactionKindOptions),
            mapping: interactionKindOptions,
        },
        placement: {
            options: placementOptions,
        },
    },
} as Meta<typeof ContextOverlay>;

let forcedUpdateKey = 0;
const Template: StoryFn<typeof ContextOverlay> = (args) => <ContextOverlay {...args} key={++forcedUpdateKey} />;

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
    },
    rootBoundary: "viewport",
    hasBackdrop: false,
    onOpening: fn(),
    onInteraction: fn(),
};
