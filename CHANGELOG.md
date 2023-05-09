# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

### Added

* `<Application* />` elements now have now defined and exposed interfaces

### Changed

* Upgraded dependencies
    * BlueprintJS was upgraded to the recent version (and a few method calls fixed after)
    * Carbon was upgraded to the recent version
    * almost all other dependencies were upgraded to their recent minor and major versions
* Removed dependencies
    * `package-json-validator` (not maintained anymore and disfunctional) - so currently there is not automatic check and validation of the `package.json` file
    * `eslint`, `eslint-config-react-app`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser` - not directly necessary, they may be still installed by other sub packages
* Changed version resolutions
    * set `postcss` to at recent version to fix a moderate security vulnerability
    * remove resolutions for `node-gyp`, `glob-parent`, `trim`, `trim-newlines`, `minimist` - packages are not use, or resolution is not necessary anymore

### Fixed

### Deprecated

## [23.1.0] - 2023-04-20

### Added

* `<Badge />` element
    * add more context like icons, text or numbers to another element
    * `<Button />` and `<IconButton />` now have a `badge` property for simple attachment
* `<ConfidenceValue/>` element
    * combines a value and a bar
* `<Depiction />` element
    * include different types of images controlling of resizing, ratio, shape
* `<EdgeLabel />` (react flow) element
    * can be used for custom edge labels, provides support for depiction, text, actions and intent states
* `<Table />`, `<TableExpandHeader />`, `<TableRow />`, `<TableExpandRow />` and `<TableCell />` elements
    * Carbon based elements
    * other table elements are still used directly from the Carbon library
* `<TestIcon />`: test icons without the need to define them via a canonical name before.
* `<Card />` property
    * `whitespaceAmount`: controls how much whitespace is displayed within the card subelements
* `<CardContent />` (react flow) property
    * `noFlexHeight`: changes the behaviour how the component uses the remaining space inside the Card element
* `<Divider />` properties
    * `width`: width of the horizontal rule
    * `alignment`: horizontal alignment of the horizontal rule
* `<EdgeDefault />` (react flow) properties
    * `strokeType`: overwrites the default style how the edge stroke is displayed
    * `intent`: visual feedback about the current state of the edge
    * `highlightColor`: color(s) of used highlights to mark the edge
* `<Markdown />` property
    * `linkTargetName`: browser target name to open links from the Markdown content
* `<MultiSelect />` property
    * `requestDelay`: To delay requests on query changes and only fire the most recent request.
* `<NodeContent />` (react flow) properties
    * `leftElement`: any element that should be displayed before the node label
    * `labelSubline`: displayed under the label in the header
    * `fullWidth`: stretches the node to the full available width, e.g. when used outside React Flow context
    * `enlargeHeader`: increase hight of header
    * `border`: property to overwrite default styles
    * `intent`: visual feedback about the current state of the node
    * `highlightColor`: color(s) of used highlights to mark the node, together with `intent` it replaces `highlightedState`
* `<Pagination />` property
    * `hideBorders`: element is displayed without dividing borders
* `<Tag />` property
    * add support for `intent` property
* `<TextField />` and `<TextArea />` property
    * `invisibleCharacterWarning`: callback to warn of invisible, hard to spot characters in the input text.
    * `intent`: state of the text field
* `<ReactFlow />` property
    * `scrollOnDrag`: Support to scroll the pane when going beyond the pane borders on all drag and connection operations.
* `<SilkActivityControl />` property
    * `executePrioritized` that is executed when the 'start prioritized' button is clicked while an activity is waiting for execution.
* `<WhiteSpaceContainer />` property
    * `linebreakForced`: insert line breaks within an otherwise unbreakable string to prevent text from overflowing the container

### Changed

* use option `--outputCss` for `yarn compile-scss` to get the transpiled CSS echoed out
* upgrade to Carbon icons v11
* switch from `carbon-components` to `@carbon/styles`
* `<GridRow />` property `dontWrapColumns=true` only works for grids on medium sized and larger viewports
* `<NodeContent />` animation is now displayed on the border, not by a pulsing shadow anymore
* `<NodeDefault />`, `<NodeContent />` and `<HandleDefault />` support now React Flow 9 and 10

### Fixed

* `<WorkspaceContent />`: do not prevent wrapping the columns of the included grid
* `<SingleLineCodeEditor />`: Convert multi-line initial value to a single line value.
* `<MenuItem />`: do not display empty icon wrapper.
* `<MultiSelect />`: Requests e.g. on slow networks could get mixed up, resulting in not showing the most recent results.

### Deprecated

* `<Grid />` property `fullWidth` is now deprecated as grids are always used for the full viewport width
* `<NodeContent />` property `highlightedState` is replaced by `intent` and `highlightColor` and should not be used anymore
* `<CardHeader />` properties `densityHigh` and `hasSpacing` are now deprecated, use `Card.whitespaceAmount` now
* `<TextField />` properties `hasStatePrimary`, `hasStateSuccess`, `hasStateWarning` and `hasStateDanger` are now deprecated, use `intent` now


## [23.0.0] - 2022-11-18

### Added

* `<CodeEditor />` element based on `CodeMirror` library, supporting Markdown, Python, Sparql, SQL, Turtle and XML syntax
* `<HoverToggler />` element that allows to switch elements when hovered over.
* `<InteractionGate />` element that can wrap content that need to be blocked from user interactions, it also has options to display a spinner as overlay
* `<Tree />` component
* `<TabPanel />` component that can be used if `<Tabs />` is used in uncontrolled mode.
* `<ReactFlowMarkers />` custom markers for ReactFlow edges, currently one new marker `arrowClosed-inverse` available
* `<StickyNoteNode />`, usable by `stickynote` type in react flow editors for workflows and linking rules
* `CssCustomProperties` and `getColorConfiguration` utilities can be used to exchange color configurations between SCSS and JS
* `decideContrastColorValue` method to get a second color related to the lightness of the testes input color
* `<SimpleDialog />`: properties `showFullScreenToggler` and `startInFullScreenMode`
* `<EdgeDefault />`: new properties for the edge data
    * `markerStart` allows to add a marker to the edge starting point
    * `inversePath` allows to inverse the edge direction
    * `renderLabel` function to render fully custom edge label including any ReactNode
* `<NodeContent />`: property `footerContent` to add footer content to a react flow node
* `<AutoSuggestion>`: properties `autoCompletionRequestDelay` and `validationRequestDelay`, to configure the delay when a request is sent after nothing is typed in anymore.
* `<FieldItemRow`: property `justifyItemWidths` to display all children using equal width inside the row
* `<BreadcrumbList />`: properties `ignoreOverflow` and `latenOverflow`, that can be used to implement a second overflow strategy beside BlueprintJS overflow list, for example in case the overflow list leads to re-rendering loops
* `<Spinner />`: `showLocalBackdrop` property to include backdrop behind spinner making the background less visible
* `<ContextMenu />`: `disabled` property that disables the button to open the menu.
* `<Tooltip />`: properties `markdownEnabler` and `markdownProps` to enable better formatted tooltips with options for line breaks, etc.
* `<AutoCompleteField />`: `onlyDropdownWithQuery` property to prevent dropdown as long as the input field is empty
* large addition to the Storybook, we almost doubled available components and stories

### Fixed

* allow children of `<Accordion />` item to get calculated based on their DOM sizes
* add borders to CodeMirror editor area and include display of focused state
* GUI elements library can be now used easier in applications because it does not force usage of SCSS modules via JS/Webpack4
* fixed ReactFlow stories re-rerender on configuration change
* fix used font family and layout of `<AutoSuggestion />` element, and justify it with the other single line text inputs
* fix condition to include the class name of a `<TagList />` and set maximum width for the items
* fixed `<MultiSelect />` to correctly update created items that are selected while still maintaining a cache of all newly created items
* do not change cursor to pointer by default on tooltip targets

### Changed

* move style imports of CodeMirror layout to `extensions`
* color configurations for react flow editor are not exported as modules anymore, they need to be fetched by `getColorConfiguration` method in JS directly
* BlueprintJS was upgraded to a recent v4
    * elements were also upgraded to usage of `Popover2`, `Tooltip2`, `Select2`, `MultiSelect2` and `Breadcrumbs2`
    * this comes also with a necessary switch from `node-sass` to `sass` package, a javascript port from the original dart sass library, see migration notes to update your build process
* `<TextField />` and `<AutoCompleteField />` now include a `title` attribute on the natively used `input` element to show the value if it is `disabled` or `readOnly`
* flashing color regarding the intent state of a `<TextField />`
* `<AutoCompleteField />`: Add 'hasBackDrop' parameter to use a backdrop for its popover in order for outside clicks to always close the popover. Default: false

### Migration notes

* old `{ colors }` imports for `cmem/react-flow/configurations/*` do not keep working anymore, use `getColorConfiguration` method now
* `<IconButton>`: `tooltipOpenDelay` was removed, use `tooltipProps.hoverOpenDelay` directly
* `<FieldItem>`: `labelAttributes` was renamed to `labelProps`
* `<MenuItem>`: this element now extends directly the Blueprint element, so `internalProps` was removed, use properties directly on `MenuItem`
* `<AutoCompleteField>`: `popoverProps` was renamed to `contextOverlayProps`
* `<Button>`: `tooltipProperties` was renamed to `tooltipProps`
* `<ContextMenu>`: use `contextOverlayProps` to route properties to the overlay element
* `<Icon>`: `tooltipProperties` was renamed to `tooltipProps`, `tooltipOpenDelay` was removed, use `tooltipProps.hoverOpenDelay` directly
* `<Label>`: `tooltipProperties` was renamed to `tooltipProps`
* `<MultiSelect>`: `popoverProps` was renamed to `contextOverlayProps`
* `<Select>`: `popoverProps` was renamed to `contextOverlayProps`
* `<Tooltip>`: this element now extends directly the Blueprint element, so `tolltipProps` was removed, use properties directly on `Tooltip`
* `<BreadcrumbItem>`: `IBreadcrumbItemProps` interface was renamed to `BreadcrumbItemProps`
* `BreadcrumbList`: `IBreadcrumbListProps` interface was renamed to `BreadcrumbListProps`

#### Switch from `node-sass` to `sass`

1. Remove `node-sass` and add `sass` package via npm or yarn:
   ```
   $ yarn remove node-sass && yarn add --dev sass
   ```
2. Include `sass` and our configuration
   ```
   const sass = require('sass');
   const sassRenderSyncOptions = require("@eccenca/gui-elements/config/sassOptions");
   ```
3. Configure the webpack `sass-loader`, you can extend this by options regarding the provided loader interface
   ```
   {
       loader: "sass-loader",
       options: {
           implementation: sass,
           sassOptions: sassRenderSyncOptions,
       },
   }
   ```

## [22.1.0] - 2022-05-16

### Added

* `MultiSelect` element that let select multiple options and adding new elements.
* `ReactFlow` element with `configuration` property to load it with pre-set configurations for node and edge types
* `Tab` element got new property for `backgroundColor`
* Support highlighting of div elements via `eccgui-container--highlighted` class
* Allow DefaultNode's execution buttons to read and adjust state of the node content in order for them to have effects on the node content
* `letPassWheelEvents` property for `<NodeContent />` elements to enable/disable mouse wheel event propagation to the react flow zoom pane
* `scrollinOnFocus` property for `<Card />` element, enables card to scroll controlled into the viewport
* `slideOutOfNode` property for `<NodeContentExtension />` element, by default it is disabled
* `labelWrapper` and `hasSpacing` properties for `<ActivityControlWidget />` to enable more control over its display from outside
* `noScrollbarsOnChildren` property for `<HtmlContentBlock />` to allow merging scroll bars of both axes

### Fixed

* text color of button inside `<Notification />` element is not changed when it has an explicit intent state
* use correct import paths in ESM distribution exports
* correct alignment of children in vertical toolbar

### Changed

* Allow `round` attribute in `Tag` component
* Allow tooltips on buttons only if they do not set on `loading` state
* Improve routing calculations of `<ReactFlow />` edges reagrding our current use cases
* Expose `<NodeTools />` menu API to ouside elements
* `<ActivityExecutionErrorReportModal />` now offers always the option to display it in fullscreen size

### Deprecated

* deprecated `<Tabs/>` interface for tab items was removed, if necessary it can be used now from `legacy-repelacements` imports

## [22.0.1] - 2022-04-11

### Fixed

* make used package version more stable, re-allowing also a yarn lock file
* correct documentation about package registry

## [22.0.0] - 2022-04-08

### Added

* `Tag` element got new property for `backgroundColor`
* Styles for footnotes and task lists, rendered by Markdown GFM parser.
* React-Flow `NodeContent` element can now be extented by `contentExtension` property containing a `NodeContentExtension` element.

### Fixed
* Add missing import to `components/Spinner/Spinner.tsx`.
* Add bottom white space in tables in content block elements.
* `fullWidth` on/off display of `TextField` is now working like expected

### Changed
* `TextField` elements are using `fullWidth=true` by default
* `SearchField` uses now by default `"operation-search"` as `leftIcon`

### Deprecated

* `SimpleDialog` element now uses `intent` property instead of `intentClassName`

## [21.11.1] 2021-11-24

### Added

* Changelog documentation
* Readme project overview

## 21.11

### Added

* Iframe and IframeModal basic elements
* Support for special components shared between applications of the eccenca Corporate Memory GUI
    * ActivityControl widget
    * ContentBlobToggler component
    * Markdown parser widget
* Support animated NodeDefault shadows to visualize activities
* Height of NodeDefault can be aligned to number of handles
* React-Flow Minipmap can be used for navigation on canvas
* Support more icons
* Support intent states for Icon

### Changed

* ApplicationContainer is not based on Carbon anymore
    * sidenav expansion state must be managed outside of that element now
* OverviewItemActions can be shown only when OverviewItem is hovered
* Rail naviagtion is openen just after a short delay to prevent openeing on wrong hover actions
* Use own property to hide overflow content in ToolbarSection

### Fixed

* Stabilize icon dimensions
* Small font size amrkup now works inside HTML content block
* Stabilize tabs
* Do not ignore size and stroke properties for Spinner

## 21.06

### Added

* First release, it provides:
    * Basic GUI elements based on BlueprintJS and IBM Carbon Design System
        * Accordion
        * Application layout
        * AutocompleteField
        * Breadcrumb
        * Button
        * Card
        * Checkbox
        * ContextOverlay
        * Dialog
        * Form
        * Grid
        * Icon
        * Intent
        * Label
        * Link
        * Menu
        * Notification
        * NumericInput
        * OverviewItem
        * Pagination
        * PropertyValuePair
        * RadioButton
        * Separation
        * SimpleTable
        * Spinner
        * Structure
        * Switch
        * Tabs
        * Tag
        * TagInput
        * TextField
        * Toolbar
        * Tooltip
        * Typography
        * Workspace view parts
    * Extensions for React-Flow
        * EdgeDefault
        * EdgeStep
        * EdgeTools
        * HandleContent
        * HandleDefault
        * NodeDefault
        * NodeTools
