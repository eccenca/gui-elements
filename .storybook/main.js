module.exports = {
    stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/preset-scss",
        "@storybook/addon-jest",
    ],
    framework: "@storybook/react",
    typescript: {
        reactDocgen: 'react-docgen-typescript',
        reactDocgenTypescriptOptions: {
            // include properties from extended interfaces
            compilerOptions: {
                allowSyntheticDefaultImports: false,
                esModuleInterop: false,
            },
            // exclude properties from basic HTML and DOM elements
            propFilter: (prop, component) => {
                if (prop.declarations !== undefined && prop.declarations.length > 0) {
                    const hasPropAdditionalDescription = prop.declarations.find((declaration) => {
                        return !(
                            declaration.fileName.includes("@types/react") ||
                            declaration.name === "DOMAttributes" ||
                            declaration.name === "HTMLAttributes"
                        );
                    });
                    return Boolean(hasPropAdditionalDescription);
                }
                return true;
            },
        }
    }
};
