const sass = require('sass');

const svgIcon = (_iconpath, _selector) => { return new sass.SassString("unset"); };
const functions = {
    'svg-icon($path, $selectors: null)': function(path, selectors) {
        return svgIcon(path, selectors)
    },
};

module.exports = {
    stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-jest",
        {
          name: "@storybook/preset-scss",
          options: {
            sassLoaderOptions: {
              implementation: sass,
              sassOptions: {
                  functions,
              },
            }
          }
        }
    ],
    framework: "@storybook/react",
    typescript: {
        reactDocgen: 'react-docgen-typescript',
        reactDocgenTypescriptOptions: {
            compilerOptions: {
                // include properties from extended interfaces
                allowSyntheticDefaultImports: false,
                esModuleInterop: false,
            },
            propFilter: (prop, component) => {
                if (!prop.description) {
                    // exclude properties without description
                    return false;
                }
                if (prop.declarations !== undefined && prop.declarations.length > 0) {
                    // exclude properties from basic HTML and DOM elements
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
