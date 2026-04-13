const sass = require("sass");
const path = require("path");
const sassRenderSyncConfig = require("./../scripts/sassConfig");

module.exports = {
    stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-jest",
        {
            name: "@storybook/preset-scss",
            options: {
                sassLoaderOptions: {
                    implementation: sass,
                    sassOptions: sassRenderSyncConfig,
                },
            },
        },
        "@storybook/addon-webpack5-compiler-babel",
    ],
    framework: {
        name: "@storybook/react-webpack5",
        options: {},
    },
    typescript: {
        reactDocgen: "react-docgen-typescript",
        reactDocgenTypescriptOptions: {
            compilerOptions: {
                // include properties from extended interfaces
                allowSyntheticDefaultImports: false,
                esModuleInterop: false,
            },
            propFilter: (prop, component) => {
                if (!prop.description) {
                    // exclude properties without description
                    if (prop.declarations !== undefined && prop.declarations.length > 0) {
                        // except if they are fetched from carbon
                        const isFetchedFromCarbon = prop.declarations.find((declaration) => {
                            return declaration.fileName.includes("@types/carbon-components-react");
                        });
                        // except if they are fetched from carbon
                        const isFetchedFromReactFlow = prop.declarations.find((declaration) => {
                            return declaration.fileName.includes("react-flow-renderer");
                        });
                        return Boolean(isFetchedFromCarbon || isFetchedFromReactFlow);
                    }
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
        },
    },
    webpackFinal: async (config, { configType }) => {
        // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
        if (configType === "PRODUCTION") {
            // remove source maps from production storybook
            // this may lead to errors when it is created via github workers
            // reason is currently not known
            config.devtool = false;
        }
        config.module.rules = [
            {
                test: /\.(png|jpg|gif|svg)(\\?.*)?$/,
                include: /\.tobase64\./,
                loader: "url-loader",
                options: {
                    limit: true,
                },
            },
            ...config.module.rules.map((rule) => {
                if (
                    rule.test &&
                    rule.test
                        .toString()
                        .includes("(svg|ico|jpg|jpeg|png|apng|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)")
                ) {
                    rule["exclude"] = /\.tobase64\./;
                }
                return rule;
            }),
        ];
        config.resolve.alias = {
            ...config.resolve.alias,
            // Fix nasty bug with importing from this package, Storybook webpack cannot resolve it otherwise
            "@codemirror/legacy-modes": path.resolve(__dirname, "../node_modules/@codemirror/legacy-modes"),
        };
        return config;
    },
    docs: {
        autodocs: true,
    },
};
