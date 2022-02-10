import { withTests } from "@storybook/addon-jest";
import "../index.scss";
// import jestResults from "../.jest-test-results.json";

const getJestResults = () => {
    try {
        return require("../.jest-test-results.json");
    } catch (err) {
        return {};
    }
};

const jestResults = getJestResults();

export const decorators = [
    withTests({
        jestResults,
    }),
];

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};
