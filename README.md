# eccenca GUI elements

Collection of React elements based on [Palantir BlueprintJS](https://blueprintjs.com/) and [IBM Carbon](https://www.carbondesignsystem.com/), used for [eccenca Corporate Memory](https://eccenca.com/products/enterprise-knowledge-graph-platform-corporate-memory) applications.

## Usage

### Installation

We provide a [package via npmjs registry](https://www.npmjs.com/package/@eccenca/gui-elements), install it by:

```
yarn add @eccenca/gui-elements
```

It could be also included as Git submodule to your projects and used via yarn link or yarn workspaces.

### Inclusion

* To include SCSS styles for all basic components add `@import "~@eccenca/gui-elements/index";` into your main SCSS file.
* To use extensions and special Corporate Memory components the include of `@eccenca/gui-elements/extensions` and  `@eccenca/gui-elements/cmem` is necessary
* To include only the default configuration add `@import "~@eccenca/gui-elements/src/configuration/variables;` into your SCSS file.

### Configuration

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

## Development

### Branch names

Aside from the `main` and `develop` branches we have some rules for branch names and they must be prefixed:

* `feature/*`: feature branches introducing new elements and functionality
* `bugfix/*`: used to fix bugs without extending functionality, leading to patch release of the most recent version
* `hotfix/*`: used to fix bugs of past versions, they can tagged directly by the developer to publish packages (not implemented yet!)
* `temp/*`: branches for testing purposes, they wont get merged, only deleted from time to time
* `release/*`: release branches, they must be created from latest `develop` via the GitHub interface

### Running tests

Run the Jest tests with `yarn test`, for test coverage information run `yarn test:coverage`.
You can check easily code for code errors by `yarn compile` (JS/Typescript) and `yarn compile-scss` (SASS).

If you run Jest tests in your app using our library you need to install `@babel/plugin-transform-runtime` as development dependeny and add it to your Babel plugins configuration.

### Running Storybook

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

### Use via yalc

If necessary you can use [yalc](https://github.com/wclr/yalc) to develop gui elements and your application side by side.

1. Install yalc globally via npm or yarn
2. Checkout [@eccenca/gui-elements](https://github.com/eccenca/gui-elements)
3. Inside gui elements folder: `yalc publish --push`
4. Inside your applications folder: `yalc link @eccenca/gui-elements`
5. After updates to the gui elements: `yarn build:all && yalc push`

### Process for pull requests and publishing releases

1. `feature/*` and `bugfix/*` branches are merged into `develop` via pull request
2. `release/*`branch is created from `develop` [via GitHub interface](https://github.com/eccenca/gui-elements/actions/workflows/release-branch.yml), there will be created a pull request automatically
    * publish release candidates from this release branch by [manual usage of a GitHub workflow](https://github.com/eccenca/gui-elements/actions/workflows/release-candidate.yml)
3. PR from release branch into `main` need to be approved
    * this will lead to a published package of the release

## License

Apache License, Version 2.0, January 2004
