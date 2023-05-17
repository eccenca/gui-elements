const sass = require('sass');
const svgIcon = (_iconpath, _selector) => {
  return new sass.SassString("unset");
};
const functions = {
  'svg-icon($path, $selectors: null)': function (path, selectors) {
    return svgIcon(path, selectors);
  }
};
module.exports = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-jest", {
    name: "@storybook/preset-scss",
    options: {
      sassLoaderOptions: {
        implementation: sass,
        sassOptions: {
          quietDeps: true,
          functions
        }
      }
    }
  }],
  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        // include properties from extended interfaces
        allowSyntheticDefaultImports: false,
        esModuleInterop: false
      },
      propFilter: (prop, component) => {
        if (!prop.description) {
          // exclude properties without description
          if (prop.declarations !== undefined && prop.declarations.length > 0) {
            // except if they are fetched from carbon
            const isFetchedFromCarbon = prop.declarations.find(declaration => {
              return declaration.fileName.includes("@types/carbon-components-react");
            });
            // except if they are fetched from carbon
            const isFetchedFromReactFlow = prop.declarations.find(declaration => {
              return declaration.fileName.includes("react-flow-renderer");
            });
            return Boolean(isFetchedFromCarbon || isFetchedFromReactFlow);
          }
          return false;
        }
        if (prop.declarations !== undefined && prop.declarations.length > 0) {
          // exclude properties from basic HTML and DOM elements
          const hasPropAdditionalDescription = prop.declarations.find(declaration => {
            return !(declaration.fileName.includes("@types/react") || declaration.name === "DOMAttributes" || declaration.name === "HTMLAttributes");
          });
          return Boolean(hasPropAdditionalDescription);
        }
        return true;
      }
    }
  },
  webpackFinal: async (config, {
    configType
  }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'

    config.module.rules = [{
      test: /\.(png|jpg|gif|svg)(\\?.*)?$/,
      include: /\.tobase64\./,
      loader: 'url-loader',
      options: {
        limit: true
      }
    }, ...config.module.rules.map(rule => {
      if (rule.test && rule.test.toString().includes("(svg|ico|jpg|jpeg|png|apng|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)")) {
        rule['exclude'] = /\.tobase64\./;
      }
      return rule;
    })];
    return config;
  },
  docs: {
    autodocs: true
  }
};
