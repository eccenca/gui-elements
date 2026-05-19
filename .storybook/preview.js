import "./styles.scss";

export const decorators = [
];

export const parameters = {
    options: {
        storySort: {
            order: ["Configuration", "Components", "Forms", "Extensions", "CMEM", "*"],
        },
    },
    actions: {
        argTypesRegex: "^on[A-Z].*",
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
    tags: ['autodocs'],
    parameters,
};

export default preview;
