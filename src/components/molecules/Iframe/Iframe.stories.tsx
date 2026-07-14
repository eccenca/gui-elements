import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import Iframe from "./Iframe";

// self-contained data URL so the story does not depend on network access
const exampleSrc =
    "data:text/html,%3Chtml%3E%3Cbody%20style%3D%22font-family%3Asans-serif%3Bpadding%3A1rem%3B%22%3E%3Ch1%3EIframe%20content%3C%2Fh1%3E%3Cp%3EThis%20content%20is%20loaded%20from%20a%20self-contained%20data%20URL.%3C%2Fp%3E%3C%2Fbody%3E%3C%2Fhtml%3E";

export default {
    title: "Components/Iframe",
    component: Iframe,
    argTypes: {
        useViewportHeight: {
            control: "select",
            options: [undefined, "quarter", "third", "half", "full"],
        },
    },
} as Meta<typeof Iframe>;

const Template: StoryFn<typeof Iframe> = (args) => <Iframe {...args} />;

export const Default = Template.bind({});
Default.args = {
    title: "Example iframe content",
    src: exampleSrc,
    useViewportHeight: "quarter",
};
