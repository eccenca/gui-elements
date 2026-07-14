const path = require("path");

module.exports = {
    stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-docs",
        "@storybook/addon-a11y",
        "@storybook/addon-webpack5-compiler-swc",
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
            // Fix nasty bug with importing from this package, Storybook webpack cannot resolve it otherwise.
            // Resolved dynamically because yarn hoisting may place the package in a parent node_modules
            // (e.g. after dependency changes) instead of this package's own node_modules.
            "@codemirror/legacy-modes": path.dirname(require.resolve("@codemirror/legacy-modes/package.json")),
            // shadcn convention: `@/` maps to this library's src (see tsconfig paths)
            "@": path.resolve(__dirname, "../src"),
        };
        return config;
    },
};
