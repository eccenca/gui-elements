import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import {
    CardHeader,
    Card,
    CardContent,
    CardTitle,
    CardOptions,
    CardActions,
} from "../";
import Divider from "../../Separation/Divider";

import { Default as CardHeaderExample } from "./CardHeader.stories";
import { Default as CardContentExample } from "./CardContent.stories";
import { Default as CardActionsExample } from "./CardActions.stories";
import { helpersArgTypes } from "../../../../.storybook/helpers";

export default {
    title: "Components/Card",
    component: Card,
    subcomponents: {
        CardHeader,
        CardTitle,
        CardOptions,
        CardContent,
        CardActions,
    },
    argTypes: {
        elevation: {
            control: { type: "number", min: 0, max: 4 },
            description: "Intensity of the drop shadow beneath the card. At elevation 0, no drop shadow is applied.",
            table: {
                type: { summary: "number: 0 to 5" },
                defaultValue: { summary: 1 },
            }
        },
        interactive: {
            control: "boolean",
            description: "Card responds to user interactions, hovering over the card will increase the card's elevation and change the mouse cursor to a pointer. Is set automatically to `true` if an `onClick` handler is available.",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            }
        },
        onClick: {
            ...helpersArgTypes.handlerOnClick,
            description: "Callback invoked when the card is clicked.",
            defaultValue: null,
            table: {
                type: { summary: "(e: MouseEvent<HTMLDivElement>) => void" },
                defaultValue: { summary: undefined },
            }
        },
        children: {
            control: "none",
            description: "Elements to include into the card container."
        }
    },
} as ComponentMeta<typeof Card>;

const TemplateFull: ComponentStory<typeof Card> = (args) => (
    <Card {...args}>
        <CardHeader {...CardHeaderExample.args} />
        <Divider />
        <CardContent {...CardContentExample.args} />
        <Divider />
        <CardActions {...CardActionsExample.args} />
    </Card>
);
export const FullExample = TemplateFull.bind({});

const TemplateSimple: ComponentStory<typeof Card> = (args) => (
    <Card {...args} />
);
export const SimpleCard = TemplateSimple.bind({});
SimpleCard.args = {
    children: [
        <CardHeader key="1"><CardTitle>Simple card</CardTitle></CardHeader>,
        <CardContent key="2">A card do not always need dividers between its components, and also action buttons are not mandatory</CardContent>
    ]
}
