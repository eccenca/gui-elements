import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { helpersArgTypes } from "../../../../.storybook/helpers";
import Spinner from "../Spinner";
export default {
    title: "Components/Spinner",
    component: Spinner,
    argTypes: {
        color: { control: "color" },
        intent: {
            ...helpersArgTypes.exampleIntent,
            options: ["UNDEFINED", "primary", "accent", "success", "warning", "danger", "none"],
        },
        position: { control: "radio", options: ["local", "inline", "global"] },
        size: { control: "radio", options: ["tiny", "small", "medium", "large", "xlarge", "inherit"] },
        stroke: { control: "radio", options: ["thin", "medium", "bold"] },
    },
} as Meta<typeof Spinner>;

const SpinnerExample: StoryFn<typeof Spinner> = (args) => (
    <div style={{ height: "300px", minHeight: "20vw", position: "relative" }}>
        <Spinner {...args} />
    </div>
);

export const Default = SpinnerExample.bind({});
Default.args = {
    color: "inherit",
    position: "local",
    showLocalBackdrop: false,
};
