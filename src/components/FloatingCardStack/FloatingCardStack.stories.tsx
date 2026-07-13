import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { FloatingCard, FloatingCardStack, FloatingCardStackCard } from "../../../index";

/**
 * A demo card built on the real `FloatingCard` chrome (title bar + pin/collapse controls when
 * expanded), so the stacking, activation and expand/collapse behaviour is visible in isolation.
 * The content changes with the `expanded` flag the stack hands to `render`.
 */
const makeCard = (key: string, title: string): FloatingCardStackCard => ({
    key,
    showLabel: `Show ${title}`,
    render: ({ expanded, pinned, onTogglePin, onCollapse }) => (
        <FloatingCard
            expanded={expanded}
            title={title}
            pinned={pinned}
            onTogglePin={onTogglePin}
            onCollapse={onCollapse}
        >
            <div className="min-h-0 flex-1 p-2 text-xs">
                {expanded ? `${title} expanded content` : `${title} preview`}
            </div>
        </FloatingCard>
    ),
});

export default {
    title: "Components/FloatingCardStack",
    component: FloatingCardStack,
} as Meta<typeof FloatingCardStack>;

const Template: StoryFn<typeof FloatingCardStack> = (args) => (
    <div style={{ position: "relative", height: "24rem", width: "22rem", border: "solid 1px" }}>
        <FloatingCardStack {...args} />
    </div>
);

export const TwoCards = Template.bind({});
TwoCards.args = {
    cards: [makeCard("chat", "Chat"), makeCard("turtle", "Turtle")],
};

export const SingleCard = Template.bind({});
SingleCard.args = {
    cards: [makeCard("turtle", "Turtle")],
};
