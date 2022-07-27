# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

### Added

* `<CodeEditor />` element based on `CodeMirror` library, supporting Markdown, Python, Sparql, SQL, Turtle and XML syntax
* `CssCustomProperties` and `getColorConfiguration` utilities can be used to exchange color configurations between SCSS and JS
* `<SimpleDialog />`: new properties `showFullScreenToggler` and `startInFullScreenMode`
* `<ReactFlowMarkers />` custom markers for ReactFlow edges, currently one new marker `arrowClosed-inverse` available
* `EdgeDefault.data.markerStart` param allows to add a marker to the edge starting point
* `EdgeDefault.data.inversePath` param allows to inverse the edge direction
* `EdgeDefault.data.renderLabel` function allows to render fully custom edge label including any ReactNode
* `StickyNoteNode`, usable by `stickynote` type in react flow editors for workflows and linking rules
* add option for `footerContent` to react flow node data

### Fixed

* allow children of `<Accordion />` item to get calculated based on their DOM sizes
* add borders to CodeMirror editor area and include display of focused state
* GUI elements library can be now used easier in applications because it does not force usage of SCSS modules via JS/Webpack4
* fixed ReactFlow stories re-rerender on configuration change

### Changed

* move style imports of CodeMirror layout to `extensions`
* color configurations for react flow editor are not exported as modules anymore, they need to be fetched by `getColorConfiguration` method in JS directly
* BlueprintJS was upgraded to a recent v4
    * elements were also upgraded to usage of `Popover2`, `Tooltip2`, `Select2` and `MultiSelect2`
    * this comes also with a necessary switch from `node-sass` to `sass` package, a javascript port from the original dart sass library, see migration notes to update your build process

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
