import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { Meta, Story } from "@storybook/react";

import { HtmlContentBlock, StickyTarget } from "../../../../index";

export default {
    title: "Components/StickyTarget",
    component: StickyTarget,
    argTypes: {},
} as Meta<typeof StickyTarget>;

const Template: Story<typeof StickyTarget> = (args) => (
    <div style={{ height: "10rem", overflow: "auto", position: "relative" }}>
        <HtmlContentBlock>
            {args.getConnectedElement && args.to !== "bottom" && (
                <p
                    id="connected-element"
                    style={{ background: "red", color: "white", padding: "0.5rem", position: "fixed", top: "20px" }}
                >
                    Top element.
                </p>
            )}
            <LoremIpsum p={3} avgSentencesPerParagraph={5} random={false} />
            <StickyTarget {...args} style={args.to === "bottom" ? { zIndex: 2 } : undefined}>
                <p style={{ color: "red", padding: "0.5rem" }}>First sticky element.</p>
            </StickyTarget>
            <LoremIpsum p={5} avgSentencesPerParagraph={5} random={false} />
            <div>
                <StickyTarget {...args}>
                    <p style={{ color: "green", padding: "0.5rem" }}>Sticky element.</p>
                </StickyTarget>
                <LoremIpsum p={5} avgSentencesPerParagraph={5} random={false} />
            </div>
            <StickyTarget {...args}>
                <p style={{ color: "blue", padding: "0.5rem" }}>Another sticky element.</p>
            </StickyTarget>
            <LoremIpsum p={5} avgSentencesPerParagraph={5} random={false} />
            {args.getConnectedElement && args.to === "bottom" && (
                <p
                    id="connected-element"
                    style={{ background: "red", color: "white", padding: "0.5rem", position: "fixed", bottom: "20px" }}
                >
                    Bottom element.
                </p>
            )}
        </HtmlContentBlock>
    </div>
);

export const Default = Template.bind({});
Default.args = {
    className: "stickytarget-extraclass",
    "data-test-id": "stickytarget-test-id",
    "data-testid": "stickytarget-testid",
};

export const ConnectedElement = Template.bind({});
ConnectedElement.args = {
    getConnectedElement: () => {
        return window.document.getElementById("connected-element") || false;
    },
};
