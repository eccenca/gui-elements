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
