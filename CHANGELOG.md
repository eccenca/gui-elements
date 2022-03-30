# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

### Added

* `Tag` element got new property for `backgroundColor`
* Styles for footnotes and task lists, rendered by Markdown GFM parser.
* React-Flow `NodeContent` element can now be extented by `contentExtension` property containing a `NodeContentExtension` element.
* `ReactFlow` element with `configuration` property to load it with pre-set configurations for node and edge types.
* Support highlighting of div elements via `eccgui-container--highlighted` class.
* Allow DefaultNode's execution buttons to read and adjust state of the node content in order for them to have effects on the node content.

### Changed
* `TextField` elements are using `fullWidth=true` by default
* `SearchField` uses now by default `"operation-search"` as `leftIcon`
* Allow `round` attribute in `Tag` component.

### Fixed
* Add missing import to `components/Spinner/Spinner.tsx`.
* Add bottom white space in tables in content block elements.
* `fullWidth` on/off display of `TextField` is now working like expected

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
