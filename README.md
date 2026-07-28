# eccenca GUI elements

Collection of React elements based on [Radix](https://www.radix-ui.com/) primitives via vendored [shadcn/ui](https://ui.shadcn.com/) components, [Lucide](https://lucide.dev/) icons and [Tailwind CSS](https://tailwindcss.com/) v4, used for [eccenca Corporate Memory](https://eccenca.com/products/enterprise-knowledge-graph-platform-corporate-memory) applications.

> **Re-platforming note:** this line replaced the former BlueprintJS/Carbon/SCSS stack.
> See [`RESTYLING.md`](./RESTYLING.md) for what changed and the design decisions behind it,
> and the [`CHANGELOG.md`](./CHANGELOG.md) "Unreleased" section for the itemized API changes
> and migration notes.

## Usage

### Installation

We provide a [package via npmjs registry](https://www.npmjs.com/package/@eccenca/gui-elements), install it by:

```
yarn add @eccenca/gui-elements
```

It could be also included as Git submodule to your projects and used via yarn link or yarn workspaces.

React 19 is required (the vendored shadcn/ui components rely on ref-as-prop).

### Inclusion

- Styles ship as pre-compiled CSS: import `@eccenca/gui-elements/css/index.css` (the package
  `style` field points there). The former SCSS bundle and the `sassOptions` export are gone.
- Applications that build with Tailwind can additionally consume the shared theme
  (`src/tailwind/theme.css`) to get the design tokens and `ecc-*` palette utilities.

### Configuration

Theming is driven by the design-token sheet [`src/tailwind/theme.css`](https://github.com/eccenca/gui-elements/blob/develop/src/tailwind/theme.css) (OKLCH semantic tokens such as `--background`, `--primary`, `--brand`, with light and dark variants).

#### Colors

The eccenca color palette is the basic foundation for color configurations. It is defined
in 4 sections (`identity`, `semantic`, `layout`, `extra`) containing various color ramps,
each ramp includes 5 weights from 100 (light) to 900 (dark).

Since v27 the palette is defined in [`src/configuration/colorPalette.ts`](https://github.com/eccenca/gui-elements/blob/develop/src/configuration/colorPalette.ts)
(single source of truth) and exposed as Tailwind theme tokens `--color-ecc-{ramp}-{weight}`
in [`src/tailwind/theme.css`](https://github.com/eccenca/gui-elements/blob/develop/src/tailwind/theme.css).
Applications built with the shared Tailwind entries get utility classes for every palette
color: `bg-ecc-orange-300`, `text-ecc-foreground-700`, `border-ecc-magenta-500`, and so on.

Ramp names: `orange` (brand), `blue` (accent), `foreground` and `surface` (neutral text and
background ramps), the semantic roles `info`/`success`/`warning`/`danger`, the categorical
hues `yellow`/`purple`/`magenta`/`pink`/`violet`/`indigo`/`petrol`/`cyan`/`teal`/`lime`/`amber`/`vermilion`/`grey`,
and the extras `gold`/`silver`/`bronze`.

Prefer the semantic design tokens (`--primary`, `--brand`, `--destructive`, ...) for UI
states and application chrome; use the ramp utilities where a specific hue is the point
(graph nodes, tags, charts). In JavaScript, use the exported `eccColorPalette` constant or
`listPaletteColors()` instead of reading custom properties from the CSSOM.

DEPRECATED: the former CSS custom properties
`--eccgui-color-palette-{groupname}-{colortint}-{colorweight}` (e.g.
`--eccgui-color-palette-identity-brand-100`) are still provided as aliases of the
`--color-ecc-*` tokens but are planned for removal in v28.

#### Sizes

Typography and spacing follow the Tailwind type/spacing scale defined by the theme (16px rem
root). The former SCSS size variables (`$eccgui-size-*`) were removed with the sass toolchain.

## Development

### Branch management

We have 4 types of major branches representing the current state:

- `main`: contains the latest official release, only `release/*` branches will be merged into this branch
- `develop`: contains the latest state of development, `feature/*`, `bugfix/*` and `next` branches will be merged into `develop`
- `next`: development tree for an upcoming new major version, it will be merged into `develop` at some point, `feature/*`, `bugfix/*` and `release/*` branches will be merged into it
- `legacy`: development tree for the predecessor of the current major version, only `bugfix/*` and `hotfix/*` branches will be merged into it

We allow a few more prefixes for valid branchnames:

- `feature/*`: extend functionality
- `fix/*`, `bugfix/*`, `hotfix/*`: fix functionality
- `release/*`: branches to finalize releases, also used to publish release candidate packages
- `change/*`, `temp/*`, `test/*`: unspecific changes, maybe only created to test something that won't end necessarily in a PR
- `maintain/*`: maintain dependencies, changes created in publishing process

`next` and `legacy` only exist if necessary, otherwise we do not maintain those branches. Merges into `main`, `develop`, `next` and `legacy` are always managed by pull requests.

### Running tests

Run the Jest tests with `yarn test`, for test coverage information run `yarn test:coverage`.
You can check easily code for code errors by `yarn compile` (JS/Typescript) and `yarn compile:test` (stories and tests).

If you run Jest tests in your app using our library you need to install `@babel/plugin-transform-runtime` as development dependeny and add it to your Babel plugins configuration.

### Running Storybook

All story source files are kept in the respective components, extensions and cmem folders, using `*.stories.tsx` file name pattern.
Run the storybook by

```
yarn install
yarn storybook
```

If you want to include Jest test results into the Storybook, run `yarn test:generate-output` before `yarn storybook`.
If the stories and the tests share exactly the compononent name in the file names, e.g. `Button.stories.tsx` and `Button.`, then tests are included automazically when the test output is available.
In case the file names cannot match by pattern then test file names need to be configured in the stories:

```javascript
Default.parameters = {
    jest: "MyTestFile.test.tsx",
};
```

### Naming conventions

- Use a `*Props` suffix for component interfaces.
- Use a `*Utils` suffix for objects providing helper functions to compoents.
  Name should start with a lowercase letter.

Don't forget to export them.
They need to be available via simple import from `@eccenca/gui-elements`.

Example: if you have your `SimpleComponent` then provide at least `SimpleComponentProps`, maybe `simpleComponentUtils`.

### Use via yalc

If necessary you can use [yalc](https://github.com/wclr/yalc) to develop gui elements and your application side by side.

1. Install yalc globally via npm or yarn
2. Checkout [@eccenca/gui-elements](https://github.com/eccenca/gui-elements)
3. Inside gui elements folder: `yarn build:all && yalc publish --push`
4. Inside your applications folder: `yalc add @eccenca/gui-elements`
5. After updates to the gui elements rebuild and update the applications yalc folder: `yarn build:all && yalc publish --push` (you usually are not required to fire another `yalc add` in your applications folder)

After you tested the GUI elements package locally you can Clean up your applications folder by `yalc remove --all && git checkout -- pakage.json yarn.lock`.

### Process for pull requests and publishing releases

1. `feature/*` and `bugfix/*` branches are merged into `develop` (or `next` and `legacy`) via pull request
    - to test out specific features or bugfixes via npm packages, the can be pre-released by using the ["Publish: feature/fix pre-release" action](https://github.com/eccenca/gui-elements/actions/workflows/publish-featurefix-prerelease.yml)
2. `release/*`branch is created from `develop` (or `next` and `legacy`) via ["Create: release branch"](https://github.com/eccenca/gui-elements/actions/workflows/create-release-branch.yml), there will be created a pull request automatically
    - publish release candidates from this release branch by triggering the ["Publish: release candidate"](https://github.com/eccenca/gui-elements/actions/workflows/publish-release-candidate.yml)
3. Pull request from release branch into `main` need to be approved
    - then ["Publish: final release "](https://github.com/eccenca/gui-elements/actions/workflows/publish-final-release.yml) can be used on `main` (or `next` and `legacy`) to publish final release packages
    - another PR is automatically created for changes done during publishing process

## License

Apache License, Version 2.0, January 2004
