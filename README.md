# eccenca GUI elements

Collection of React elements based on [Palantir BlueprintJS](https://blueprintjs.com/) and [IBM Carbon](https://www.carbondesignsystem.com/), used for [eccenca Corporate Memory](https://eccenca.com/products/enterprise-knowledge-graph-platform-corporate-memory) applications.

## Install

We provide packages via [npm registry of GitHub Packages](https://npm.pkg.github.com), you need to enhance your project `.npmrc` file by:

```
@eccenca:registry=https://npm.pkg.github.com
```

It could be also included as Git submodule to your projects and used via yarn link or yarn workspaces.

## Usage

* To include SCSS styles for all basic components add `@import "~@eccenca/gui-elements/index";` into your main SCSS file.
* To use extensions and special Corporate Memory components the include of `@eccenca/gui-elements/extensions` and  `@eccenca/gui-elements/cmem` is necessary
* To include only the default configuration add `@import "~@eccenca/gui-elements/src/configuration/variables;` into your SCSS file.

### Justify default configuration

All [configuration variables](https://github.com/eccenca/gui-elements/blob/develop/src/configuration/_variables.scss) can be set before importing the full library or the default configuration but for the main changes you should need to change only a few parameters:

* Basic colors
    * `$eccgui-color-primary`: color for very important buttons and switches
    * `$eccgui-color-primary-contrast`: readable text color used on primary color areas
    * `$eccgui-color-accent`: color for most conformation buttons, links, etc
    * `$eccgui-color-accent-contrast`: readable text color used on accent color areas
    * `$eccgui-color-applicationheader-text`
    * `$eccgui-color-applicationheader-background`
    * `$eccgui-color-workspace-text`
    * `$eccgui-color-workspace-background`
* Basic sizes
    * `$eccgui-size-typo-base`: size including absolute unit, currently only `px` is supported
    * `$eccgui-size-typo-base-lineheight`: only ratio to font size, no unit!
    * `$eccgui-size-type-levelratio`: ratio without unit! used to calculate different text sizes based on `$eccgui-size-typo-base`
    * `$eccgui-size-block-whitespace`: white space between block level elements, currently only `px` is supported

## Running tests

Run the Jest tests with `yarn test`, for test coverage information run `yarn test:coverage`.
You can check easily code for code errors by `yarn compile` (JS/Typescript) and `yarn compile-scss` (SASS).

## Running Storybook

All storiy source files are kept in the respective components, extensions and cmem folders, using `*.stories.tsx` file name pattern.
Run the storybook by

```
yarn install
yarn storybook
```

If you want to include Jest test results into the Storybook, run `yarn test:generate-output` before  `yarn storybook`.
If the stories and the tests share exactly the compononent name in the file names, e.g. `Button.stories.tsx` and `Button.`, then tests are included automazically when the test output is available.
In case the file names cannot match by pattern then test file names need to be configured in the stories:

```javascript
Default.parameters = {
    jest: "MyTestFile.test.tsx",
};
```

## License

Apache License, Version 2.0, January 2004
