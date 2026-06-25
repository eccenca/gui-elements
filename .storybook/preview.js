import React from "react";

import ApplicationContainer from "../src/components/Application/ApplicationContainer";
import ApplicationContent from "../src/components/Application/ApplicationContent";

import "./styles.scss";

export const parameters = {
    options: {
        storySort: {
            order: ["Configuration", "Components", "Forms", "Extensions", "CMEM", "*"],
        },
    },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};

const preview = {
    // Enables auto-generated documentation for all stories
    // @see https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
    parameters,
    decorators: [
        (Story) => (
            <ApplicationContainer style={{ position: "relative" }}>
                <ApplicationContent>
                    <Story />
                </ApplicationContent>
            </ApplicationContainer>
        ),
    ],
};

export default preview;
