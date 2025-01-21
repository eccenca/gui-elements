# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

This is a major release, and it might be not compatible with your current usage of our library. Please read about the necessary changes in the section about how to migrate.

### Migration from v24 to v25

-   upgrade Node to at least v18.18, see **Changed** section for more info about it
-   remove deprecated components, properties and imports from your project, if the info cannot be found here then it was already mentioned in **Deprecated** sections of the v24.* changelogs.
    -   we changed the integration of the supported react flow versions, formerly names `legacy` and `next` resources were renamed to more precise `v9` and `v10`, please see all info in the section about changes

### Changed

-   `eslint` libraries were upgraded to v9, so `node` v18.18 or higher is required
-   react flow integration by renaming their resources from `legacy` and `next` to more precise `v9` and `v10`:
    -   `HandleProps`: renamed to `HandleV9Props`
    -   `HandleNextProps`: renamed to `HandleV10Props`
    -   if provided then the `flowVersion` property do not accept `legacy` and `next` as values anymore, use `v9` and `v10`

### Deprecated

-   `HandleV9Props` and `HandleV10Props` export will be removed, use only `HandleDefaultProps`
-   `<NodeContent />`
    -   `businessDate`: will be removed because it is already not used
-   `<ReactFlow />`: use `<ReactFlowExtended />`

## [24.0.0] - 2024-12-17

This is a major release, and it might be not compatible with your current usage of our library. Please read about the necessary changes in the section about how to migrate.

### Migration from v23 to v24

-   upgrade Typescript to v5
-   upgrade Node to at least v18, see **Changed** section for more info about it
-   remove deprecated components, properties and imports from your project, if the info cannot be found here then it was already mentioned in **Deprecated** sections of the past changelogs
    -   `<GridColumn/>`
        -   `full`: was deprecated and now removed because it always uses full width if it is the only column and does not have any othe size config
    -   `<Notification/>`
        -   `fullWidth`: was deprecated and now removed, use `flexWidth` as replacement
        -   `iconName`: was deprecated and now removed, use `icon` property
    -   `<Table/>`
        -   `size`: use only "small", "medium" or "large" as value
    -   `<Tag/>`
        -   `emphasized`: was deprecated and now removed, use `minimal=false` plus `emphasis="stronger"` instead
    -   `IconSized` type: use `CarbonIconType`
    -   `TimeUnits` type: use `ElapsedDateTimeDisplayUnits`
    -   `MarkdownParserProps` interface: use `MarkdownProps`
    -   `elapsedTimeSegmented` function: use `elapsedDateTimeDisplayUtils.elapsedTimeSegmented`
    -   `simplifiedElapsedTime` function: use `elapsedDateTimeDisplayUtils.simplifiedElapsedTime`

### Added

-   `<StringPreviewContentBlobToggler />`:
    -   `noTogglerContentSuffix`: Allows to add non-string elements at the end of the content if the full description is shown, i.e. no toggler is necessary. This allows to add non-string elements to both the full-view content and the pure string content.
-   `<MultiSuggestField />`
    -   An optional custom search function property has been added, it defines how to filter elements.
    -   Added a prop `limitHeightOpened` to limit the height of the dropdown by automatically calculating the available height in vh.
-   `<FlexibleLayoutContainer />` and `<FlexibleLayoutItem />`
    -   helper components to create flex layouts for positioning sub elements
    -   stop misusing `Toolbar*` components to do that (anti pattern)
-   `<PropertyValueList />` and `<PropertyValuePair />`
    -   `singleColumn` property to display label and value below each other
-   `<Label />`
    -   `emphasis` property to control visual appearance of the label text
-   basic Storybook example for `<Application* />` components
-   `<CodeEditor />`
    -   `setEditorView` option for compatibility to Codemirror v6
    -   `supportCodeFolding` optional property to fold code for the supported modes e.g: `xml`, `json`, etc.
    -   `shouldHighlightActiveLine` optional property to highlight active line where the cursor is currently in.
    -   `shouldHaveMinimalSetup` optional property that imports codemirror's base minimal configurations.
    -   `additionalExtensions` optional property for additional extensions to customize the editor further.
-   `<Markdown />`
    -   `htmlContentBlockProps` can now be used to configure the wrapper around the Markdown content
-   `$eccgui-selector-text-spot-highlight` SCSS config variable to specify selector that is used to create shortly highlighted spots
    -   it is highlighted when the selector is also active local anchor target or if it has the `.eccgui-typography--spothighlight` class attached to it

### Fixed

-   toggling on/off the `<HandleTools/>` was corrected, they kept displayed after re-entering with the cursor
-   `<Pagination/>`
    -   change text overflow for selectors to `clip` because Firefox rendered `ellipsis` a bit too early
-   `<ApplicationContainer />`:
    -   `useDropzoneMonitor` helper hook process was improved so that less events are processed and the dropzone monitoring is more stable

### Changed

-   GUI elements library needs node 18 or an higher version because dependencies were upgraded
    -   you may run into problems if you try it with Node v16 or v17, or Webpack v4, mainly because of a Node bugfix regarding the OpenSSL provider
    -   if you cannot upgrade your dependencies then you could workaround that by patching the `crypto` package or using Node with `--openssl-legacy-provider` option
    -   see https://github.com/webpack/webpack/issues/14532 and https://stackoverflow.com/questions/69692842/ for more info and possible solutions
-   upgrade to `@carbon/react` package
    -   almost all Carbon related packages were replaced by using only `@carbon/react`
    -   some component interfaces partly lack documentation in our Storybook because their base interfaces from `@carbon/react` are currently not exported: `AccordionItemProps`, `ApplicationHeaderProps`, `ApplicationToolbarProps`, `ApplicationToolbarActionProps`, `ApplicationToolbarPanelProps`, `CarbonIconType`, `TableCellProps`, `TableExpandRowProps`, `TableProps`
-   upgrade to Typescript v5
    -   your package should be compatible to Typescript 5 patterns
-   upgrade to Storybook v8
    -   include a few patches for actions, see https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#implicit-actions-can-not-be-used-during-rendering-for-example-in-the-play-function
-   allow `next` and `legacy` as branch names
-   `<CodeEditor />`
    -   `setInstance` interface changed to `setEditorView` for semantic compatibility to Codemirror v6
-   `<BreadcrumbItem/>`
    -   link color and separation char were adjusted
-   `<Markdown/>`
    -   align blocks for language specific code to default code blocks
-   switch icons for `item-clone` and `item-copy` to Carbon's `<Replicate/>` and `<Copy/>`
-   Remove duplicated icon names `artefact-customtask*` and only keep `artefact-task*` names.
-   `<OverviewItemDepiction/>`
    -   improve examples in storybook
    -   improve display for images that are to large for the available space (fully show them)
-   `<CodeAutocompleteField />`:
    -   Add parameter `reInitOnInitialValueChange`, to allow the field to re-initialize if the initial value changes.

### Deprecated

-   `<Icon/>` and `<TestIcon/>`
    -   `description` and `iconTitle`: use `title` as replacement.
-   `TableRowHeightSize` type: use `TableProps["size"]` directly
-   `IRenderModifiers` interface: use `SuggestFieldItemRendererModifierProps`
-   `IElementWidth` type: use `SuggestFieldItemRendererModifierProps["styleWidth"]`
-   `MultiSelectSelectionProps` interface: use `MultiSuggestFieldSelectionProps`
-   `MultiSelectProps` interface: use `MultiSuggestFieldProps`
-   `nodeTypes` and `edgeTypes`
    -   will be removed without replacement, define it yourself or use `<ReactFlow/` with `configuration` option
-   `AutoCompleteFieldProps` and `IAutoCompleteFieldProps` interfaces: use `SuggestFieldProps`
-   `<CodeAutocompleteField/>`
    -   `AutoSuggestionProps`: use `CodeAutocompleteFieldProps` instead
    -   we renamed `ISuggestionBase`, `ISuggestionWithReplacementInfo`, `IReplacementResult`, `IPartialAutoCompleteResult`, `IValidationResult` to `CodeAutocompleteFieldSuggestionBase`, `CodeAutocompleteFieldSuggestionWithReplacementInfo`, `CodeAutocompleteFieldReplacementResult`, `CodeAutocompleteFieldPartialAutoCompleteResult`, `CodeAutocompleteFieldValidationResult`
-   all legacy support components are going to be removed, you need to replace them by activily maintained components
    -   `<ButtonReplacement/>`: switch to `<Button />`
    -   `<AffirmativeButtonReplacement/>`: switch to `<Button affirmative />`
    -   `<DismissiveButtonReplacement/>`: switch to `<Button dismissive />`
    -   `<DisruptiveButtonReplacement/>`: switch to `<Button disruptive />`
    -   `<CheckboxReplacement/>`: switch to `<Checkbox />`
    -   `<RadioButtonReplacement/>`: switch to `<RadioButton />`
    -   `<TabsReplacement/>`: switch to `<Tabs />`
    -   `<TextFieldReplacement/>`: switch to `<TextField />`, `<TextArea />`, `<FieldItem />`
-   `MultiSuggestField.ofType` method:
    -   instead of `MyMultiSuggest = MultiSuggestField.ofType<MyType>()` use directly `<MultiSuggestField<MyType> {...props} />`
    -   `MultiSuggestField.ofType` also returns the original BlueprintJS `MultiSelect` element, not our version!

## [23.8.0] - 2024-08-19

### Added

-   `<ApplicationContainer />`:
    -   `monitorDropzonesFor` property can be used to monitor application wide dropzones for dragged elements via data attributes attached to body element containing the data transfer type of drag over events.
-   `<ReactFlow />`
    -   `dropzoneFor` property can be used to mark react flow canvas as matching area to drop dragged elements.
-   `<Accordion />`, `<AccordionItem />`
    -   `whitespaceSize` property to define how much whitespace is used on top and bottom inside the header and content of an accordion item.
    -   `separationSize` property defines how much space is used for the separation between an accordion item and the next one.
-   class name prefixes are now available by variables with more readable names:
    -   BlueprintJS: `$prefix-blueprintjs` (current value is `bp5`)
    -   Carbon Design System: `$prefix-carbon` (current value is `cds`)
    -   eccenca GUI elements: `$prefix-eccgui` (current value is `eccgui`)

### Fixed

-   `<ElapsedDateTimeDisplay />`
    -   negative values are not shown (e.g. in case server and browser clocks are apart)

### Changed

-   `<TextArea />`
    -   improve visual alignment to `TextField` regarding whitespace and colors
-   basic styles for Uppy widget were improved and moved to its own component folder

### Deprecated

-   `<Accordion />`
    -   `size` property in favour of `whitespaceSize`
-   `<AccordionItem />`
    -   `condensed` property in favour of `whitespaceSize="none"`

## [23.7.0] - 2024-06-26

### Added

-   `<ReactFlow/>`, `<StickyNoteModal/>`, `<EdgeDefault/>`, `<EdgeLabel/>`, `<HandleContent/>`, `<HandleTools/>`, `<MiniMap/>`
    -   all react flow components are now be able to process test ids as data attributes, e.g. `data-test-id` and `data-testid`, sometimes as direct property, in other cases as part of properties routed to the wrapper elements
    -   storybook documentation was enhanced by demonstration the usage of test ids
-   `<Markdown />`
    -   Do syntax highlighting when a class name is set in the form `language-<LANGUAGE_NAME>`.
-   `<StickyTarget/>`
    -   Element wraps the content that need to be displayed sticky.
-   `utils`
    -   `getScrollParent`: method to find the scroll parent of an element
-   `<SuggestField />`
    -   Support loading more results when scrolling to the end of the result list.
-   `<TextArea />`
    -   `intent` property to set the state, formerly used `hasStatePrimary`, `hasStateSuccess`, `hasStateWarning` and `hasStateDanger` properties are now deprecated
    -   `leftIcon`: set the left aligned icon
    -   `rightElement`: renders on right side
-   `<Depiction />`
    -   `disabled` property could be used if the element is used inside a disabled interactive element or form control but the state is not adapted automatically to the depiction
-   new icons: `navigation-extern`, `toggler-list`, `toggler-table`, `data-boolean`

### Fixed

-   `<MultiSuggestField />`
    -   Updated the interface with the ability to use either `selectedItems` or `prePopulateWithItems` properties, which is more logical.
    -   Fixed deferred `selectedItems` setting.
-   `<StickyNoteModal/>`
    -   static test id `data-test-id="sticky-note-modal"` will be removed with next major version
-   `<BreadcrumbsList />`
    -   `onItemClick` handler is only executed if breadcrumb has `href` set because this is one callback parameter and the handler would not have any information otherwise
-   `<Depiction />`
    -   position fixed when element is used as icon in `<Button />`
-   `<Tooltip />`
    -   fix font sizes and background colors
-   `<NodeContent />`
    -   node introduction is only processed one time even if a node update still provides a `introductionTime` property

### Changed

-   `<BreadcrumbsList />`
    -   `onItemClick` handler is only executed when the breadcrumb has no own `onClick` handler defined
-   `<Card />`
    -   `elevation` allows now `-1` as value, the card is borderless then
-   `<MultiSuggestField />`
    -   use "Search for item, or enter term to create new one..." as default `placeholder` if `createNewItemFromQuery` is given
-   `<SilkActivityControl />`
    -   interface of `initialStatus` property has been updated with the so far missing `lastUpdateTime` property. If you run in problems because of that you could use `Date.now()` as fix. Or consider to use `<ActivityControlWidget />` directly, what is probably even better.
-   `<Depiction />`
    -   opcaity is reduced automatically when element is used as icon in a disabled `<Button />`

### Deprecated

-   `<TextArea />`
    -   `hasStatePrimary`, `hasStateSuccess`, `hasStateWarning` and `hasStateDanger` properties: use the `intent` property instead.

## [23.6.0] - 2024-04-17

### Added

-   `<BreadcrumbList/>`, `<MultiSuggestField/>`, `<Notification/>`, `<Select/>`, `<Tabs/>`
    -   `data-test-id` (and `data-testid` as alias of it): can be defined to add test ids to the DOM elements
    -   `wrapperProps`: can be defined by using `div` attributes, and if given a `div` element with wrap the component. This wrapper is also used for test ids because the underlaying BlueprintJS components do not forward data attributes to the DOM.
    -   if a test id is used on `<Select/>` or `<MultiSuggestField/>` then the toggle button, the dropdown and the search filter get automatically their own test id, suffixed by `_togger`, `_drowpdown` and `_searchinput`.
-   `<CodeMirror />`:
    -   Added support for N-triples and Mathematica modes.
    -   Allow direct access to the underlying code mirror instance.
    -   Allow to register a scroll handler.
    -   Support code folding for some modes, e.g. xml, json.
-   `<Modal/>`, `<SimpleDialog/>`, `<AlertDialog/>`
    -   `data-test-id` (and `data-testid` as alias of it): can be defined to add test ids to the DOM elements
-   `<MultiSuggestField />`
    -   `selectedItems` can be used to set default selected items
-   new use hook
    -   `useApplicationHeaderOverModals`: forces the application header to be displayed over modal backgrounds
-   `ClassNames` now forwards all BlueprintJS CSS class names
    -   ```
        import { ClassNames } from "@eccenca/gui-elements";
        export const bpButtonClass = ClassNames.Blueprint.BUTTON;
        ```
-   new icons: `state-locked`, `state-unlocked`, `application-notification`

### Fixed

-   `<Card />`
    -   fix styles for `selected=true`, allow it without interactive functionality on card element
    -   align colors with active menu items
-   `<MultiSuggestField />`
    -   reset the list of options when the query is cleared but nothing from the list is selected
    -   add the created element to the list of filtered elements immediately after its creation
    -   block input if `disabled` property is set
-   `<TagList />`
    -   vertical alignment fixed in nowrap containers and for tags with icons

### Changed

-   BlueprintJS libraries was updated to v5
    -   Popover2 lib was removed because we can now again use the internal component from core lib again
-   `<ApplicationContainer />`
    -   `<OverlaysProvider />` from BlueprintJS is now used
    -   @see https://github.com/palantir/blueprint/wiki/Overlay2-migration
-   `<Tag />`
    -   included icons are always limited to the height of the text label

### Deprecated

-   `<Button />`
    -   interface `AnchorOrButtonProps` is currently exported together with the component but it will be removed with the next major version
    -   there won't be a replacement or alternate interface because `ButtonProps` should be enough
-   `<BreadcrumbList/>`
    -   property `htmlUlProps`: this is going to be removed because the BlueprintJS `Breadcrumbs` component does not support native `ul` attributes. The element provides a new `wrapperProps` property.
-   `<MultiSuggestField />`
    -   static usage of `data-test-id="clear-all-items"` for the clearance button is deprecated, will be replaced by a test id later that is created from the given test id for the component plus a `_clearance` suffix

## [23.5.0] - 2024-02-15

### Added

-   `<CodeEditor />`
    -   visualize the usage of tabulator chars by background color and arrow symbol
    -   new `tabIntentSize`, `tabIntentStyle`, `tabForceSpaceForModes` properties to give better control over tabulator usage

### Fixed

-   `<Depiction />`
    -   images representing SVG without `width` property on their root element are displayed with a minimal forced dimension to prevent that they are hidden in some browsers

## [23.4.1] - 2024-02-08

### Fixed

-   icons
    -   use older version of icon library to prevent typescript issues after changes in recent versions

## [23.4.0] - 2024-02-07

### Added

-   `<PropertyValuePair />`, `<PropertyName />`, `<PropertyValue />`
    -   `nowrap`: force display on one line without breaks
-   `<Skeleton />`
    -   provides a loading state display of its children elements
-   `<TableCell />`
    -   `alignHorizontal`: allow to center cell contents
-   `<ActivityControlWidget />`
    -   added extra line to show timer for execution period
-   `<ExtendedCodeEditor />`
    -   replaces `<SingleLineCodeEditor />` to get used for the `<CodeAutocompleteField />` component
-   new icons
    -   `data-string`, `data-url`, `data-date`, `data-time`, `data-datetime`, `data-number`

### Fixed

-   `<Pagination />`
    -   adjust color of arrow in disabled navigation button

## [23.3.1] - 2023-11-15

### Fixed

-   `<ContextOverlay />`
    -   remove always white space at start of `portalClassName` to prevent runtime error in BlueprintJS

## [23.3.0] - 2023-11-09

### Added

-   `<PropertyName />`
    -   `labelProps`: configure the automatically injected `Label` element when `PropertyName` is only a string
-   `<TextField />`
    -   `escapeToBlur`: if set to true the input field blurs/de-focuces when the `Escape` key is pressed.
-   `<CodeEditor />`
    -   support for additional modes: `jinja2`, `yaml` and `json`
    -   add read-only mode
    -   `height`: set a fixed height of the editor
    -   `wrapLines`: control auto-wrapping long lines (the default for wrap long lines is set to false now)
-   `<Modal />`
    -   `modalFocusable`: when `true` the outer `div` element of the modal can be focused by clicking on it.
        This is needed e.g. when key (down, up) events should trigger on the modal in order to bubble up to its parent elements.
    -   `forceTopPosition`: when `true` then the `z-index` of the modal's portal element is recalculated, so that the modal is always displayed on top of all other visible elements. Use with care, see documentation.
-   `<ContextOverlay />`
    -   `preventTopPosition`: when true then the `z-index` is decreased to the value for modals. Use it when you need to display modal dialogs out of the context overlay. Type of counter property to `Modal.forceTopPosition`.
-   `<ReactFlow />`
    -   support disabling the react-flow hot keys via a React context, e.g. `Delete` etc.
-   `<HandleDefault />`
    -   new `category` options that lead to different handle layouts: `dependency`, `fixed`, `flexible` and `unknown`
    -   `intent` option with defined colors for: primary, accent, info, success, warning, danger
-   `<HandleTools />`
    -   can be used as single handle content to add an context menu to handles
-   `<NodeContent />`
    -   `introductionTime`: can be used to visualize the node was added or updated
-   `<EdgeLabel />`
    -   `loose`: can be set to `true` to prevent the box with border on the label component
-   `<TableExpandHeader />`
    -   `toggleIcon`: optional icon that should be displayed instead of the default ones.
-   `utils`
    -   `getGlobalVar` and `setGlobalVar`: can be used to manage global variables indepentently from component states. They are stored to the `window` object under a `eccgui` "namespace". Can be used for example to manage globally increased counters. Do not use them if you need to store user session properties or confidential data!
-   canonical icons for `artefact-chatlog`, `entity-human`, `entity-robot` and `operation-magic`

### Changed

-   `<SimpleDialog />`
    -   by default, prevent certain (React) events from bubbling up through the dialog (backdrop is not affected):
        -   event handler: `onContextMenu`, `onDrag`, `onDragStart`, `onDragEnd`, `onMouseDown`, `onMouseUp`, `onClick`
        -   handlers can be overwritten via `wrapperDivProps`
-   `<ApplicationHeader />`
    -   it is now possible to overwrite the background color by setting `--eccgui-appheader-color-background` in its `style` attribute
-   `<Modal />`
    -   new `xlarge` size option
    -   re-configure appearance of the sizes, `small` is displayed a bit smaller, `large` a bit larger than before

### Fixed

-   `<Modal />`
    -   `Escape` key to close does not work anymore after clicking on the backdrop for `canOutsideClickClose=false` and `canEscapeKeyClose=true`.
-   `<Spacing />`
    -   allow other `div` attributes, e.g. `style`
-   tooltips of Carbon based elements are displayed correctly in position and layout
-   `<PropertyValuePair />`
    -   force maximum width for situation when the block could be wider, e.g. inside a flex layout, otherwise name and value could be wrongly aligned in a list with other property value pairs

## [23.2.0] - 2023-07-14

### Added

-   linting the code automatically via git hook on commit action
-   `<SuggestField />`
    -   will replace `<AutoCompleteField />`
    -   match dropdown to element width when `fill=true`
    -   display dropdown toggler when `onlyDropdownWithQuery=false`
-   `<MultiSuggestField />`: will replace `<MultiSelect />`
    -   `clearQueryOnSelection` option to set an empty query after selections
    -   match dropdown to element width when `fullWidth=true`
-   `<CodeAutocompleteField />`: will replace `<AutoSuggestion />`
-   `<Select />`:
    -   has now a default target when it is not controlled directly by its children
    -   `onClearanceHandler` and `onClearanceText` as options to include automatically a dedicated clearance button to the element
-   `<PropertyName />`
    -   `size` option to increase/decrease width consumed by its display
-   `<EdgeLabel />`: use `title` property on its text sub element
-   `<Application* />` elements now have defined and exposed interfaces
-   `<FieldSet />` element now have a defined and exposed interface
-   `<PropertyValue* />` elements now have defined and exposed interfaces
-   `<GridColumn />`
    -   `carbonSizeConfig` property to overwrite automatically set column sizes by using the original size config from the Carbon component
-   `<TitleSubsection />` element now have a defined and exposed interface
-   all inferfaces of the main elements in `src/components` are now exposed via `@eccenca/gui-elements`
-   all inferfaces of the main elements in `src/extensions` are now exposed via `@eccenca/gui-elements`
-   all inferfaces of the main elements in `src/cmem` are now exposed via `@eccenca/gui-elements`
-   `<ApplicationToolbarPanel  />`
    -   event handler `onLeave` and `onOutsideClick`, could be used to close the menu panel automatically

### Changed

-   `<Select />`:
    -   match dropdown to element width when `fill=true`
    -   use rounded input for query input to align it with `<SearchField />`
-   Upgraded dependencies
    -   BlueprintJS was upgraded to the recent version (and a few method calls fixed after)
    -   Carbon was upgraded to the recent version
    -   almost all other dependencies were upgraded to their recent minor and major versions
-   Removed dependencies
    -   `package-json-validator` (not maintained anymore and disfunctional) - so currently there is not automatic check and validation of the `package.json` file
    -   `eslint`, `eslint-config-react-app`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser` - not directly necessary, they may be still installed by other sub packages
-   Changed version resolutions
    -   set `postcss` to at recent version to fix a moderate security vulnerability
    -   remove resolutions for `node-gyp`, `glob-parent`, `trim`, `trim-newlines`, `minimist` - packages are not use, or resolution is not necessary anymore
-   `<ActivityControlWidget />`
    -   `IActivityAction` interface was renamed to `ActivityControlWidgetAction`
-   `<AutoSuggestion />`
    -   `IProps` interface was renamed to `AutoSuggestionProps`
-   `<AutoSuggestionList />`
    -   `IDropdownProps` interface was renamed to `AutoSuggestionListProps`
-   `<MultiSelect />`
    -   `SelectedParamsType` interface was renamed to `MultiSelectSelectionProps`
-   `<SingleLineCodeEditor />`
    -   `IEditorProps` interface was renamed to `SingleLineCodeEditorProps`
-   `<AlertDialog />`
    -   `IAlertDialogProps` interface was renamed to `AlertDialogProps`
-   `<WorkspaceHeader />`
    -   `IWorkspaceHeaderProps` interface was renamed to `WorkspaceHeaderProps`
-   `<NodeDefault />`
    -   `NodeProps` interface was renamed to `NodeDefaultProps` to justify naming convention
-   `<NodeContent />`
    -   `IHandleProps` interface was renamed to `NodeContentHandleProps` to justify naming convention
-   `Utilities` obejct was renamed to `utils` and enhanced with new functions: `getColorConfiguration`, `invisibleZeroWidthCharacters`
-   improve style imports, now it is a bit easier to inlcude all parts separately
-   `<IconButton />`
    -   prevent double tab index when it comes with an extra tooltip element attached to it
    -   prevent tooltip tab selection when button is disabled or has set inactive tabindex itself
-   `<SimpleDialog />`
    -   `enforceFocus: false` is set by default, so that searchable selects keep focus on their search input field

### Fixed

-   use correct import for codemirror stylesheetss
-   `<BreadcrumbItem />` is not displayed clickable when it has no `href` or `onClick` property set

### Deprecated

-   `Select.ofType` method:
    -   instead of `MyTypeSelect = Select.ofType<MyType>()` use directly `<Select<MyType> {...props} />`
-   `<AutoCompleteField />`: use `<SuggestField />`
-   `<MultiSelect />`
    -   `SelectedParamsType`: renamed to `MultiSelectSelectionProps`
    -   element will be re-implemented, use `<MultiSuggestField />` instead
-   `Utilities` object is now deprecated, use `utils` instead
-   `HelperClasses` object is now deprecated, use `ClassNames` instead
-   `<ActivityControlWidget />`
    -   `IActivityAction`: renamed to `ActivityControlWidgetAction`
-   `<AutoCompleteField />`
    -   `IRenderModifiers`: import from `src/components/AutocompleteField/interfaces`
    -   `IElementWidth`: import from `src/components/AutocompleteField/interfaces`
-   `<AutoSuggestion />`
    -   elemenat was renamed, use `<CodeAutocompleteField />` instead
    -   `IProps` interface is now deprecated, use `CodeAutocompleteFieldProps` instead
-   `<AutoSuggestionList />`
    -   `IDropdownProps` interface is now deprecated, use `AutoSuggestionListProps` instead
-   `<SingleLineCodeEditor />`
    -   `IEditorProps` interface is now deprecated, use `SingleLineCodeEditorProps` instead
-   `<AlertDialog />`
    -   `IAlertDialogProps` interface is now deprecated, use `AlertDialogProps` instead
-   `<WorkspaceHeader />`
    -   `IWorkspaceHeaderProps` interface is now deprecated, use `WorkspaceHeaderProps` instead
-   `<NumericInput />`
    -   It will be removed because beside the special arrow buttons it does not add any special. Could be done also with `<TextField />` combined with correct `type`.
-   `<Highlighter />`
    -   `HighlighterFunctions` renamed to `highlighterUtils`
    -   `extractSearchWords` moved to `highlighterUtils.extractSearchWords`
    -   `matchesAllWords` moved to `highlighterUtils.matchesAllWords`
    -   `createMultiWordRegex` moved to `highlighterUtils.createMultiWordRegex`
-   `<Icon />`
    -   `findExistingIconName`: use `iconUtils.findExistingIconName`
-   `<Spinner />`
    -   `SpinnerPosition`: use `SpinnerProps['position']`
    -   `SpinnerSize`: use `SpinnerProps['size']`
    -   `SpinnerStroke`: use `SpinnerProps['stroke']`
-   `ReactFlow` extensions
    -   `NodeProps`: renamed to `NodeDefaultProps`
    -   `minimapNodeClassName`: moved to `miniMapUtils.nodeClassName`
    -   `minimapNodeColor`: moved to `miniMapUtils.nodeColor`
    -   `nodeUtils`: renamed to `nodeDefaultUtils`
    -   `IHandleProps`: renamed to `NodeContentHandleProps`
    -   `NodeDimensions`: use `NodeContentProps<any>['nodeDimensions']`
    -   `HighlightingState`: use `NodeContentProps<any>['highlightedState']` (or import from `src/extensions/react-flow/nodes/sharedTypes`)
-   `ActivityControl` components:
    -   `IActivityControlLayoutProps`: renamed to `SilkActivityControlLayoutProps`
    -   `IActivityExecutionReport`: renamed to `SilkActivityExecutionReportProps`
    -   `ActivityControlTranslationKeys`: renamed to `SilkActivityControlTranslationKeys`
    -   `ActivityAction`: renamed to `SilkActivityControlAction`
    -   `IActivityControlProps`: renamed to `ActivityControlWidgetProps`
    -   `IActivityStatus`: renamed to `SilkActivityStatusProps`
    -   `ConcreteActivityStatus`: renamed to `SilkActivityStatusConcrete`
-   `ContentBlobToggler` components:
    -   `firstNonEmptyLine`: moved to `stringPreviewContentBlobTogglerUtils.firstNonEmptyLine`
-   `Markdown` components:
    -   `highlightSearchWordsPluginFactory` moved to `markdownUtils.highlightSearchWordsPluginFactory`

## [23.1.0] - 2023-04-20

### Added

-   `<Badge />` element
    -   add more context like icons, text or numbers to another element
    -   `<Button />` and `<IconButton />` now have a `badge` property for simple attachment
-   `<ConfidenceValue/>` element
    -   combines a value and a bar
-   `<Depiction />` element
    -   include different types of images controlling of resizing, ratio, shape
-   `<EdgeLabel />` (react flow) element
    -   can be used for custom edge labels, provides support for depiction, text, actions and intent states
-   `<Table />`, `<TableExpandHeader />`, `<TableRow />`, `<TableExpandRow />` and `<TableCell />` elements
    -   Carbon based elements
    -   other table elements are still used directly from the Carbon library
-   `<TestIcon />`: test icons without the need to define them via a canonical name before.
-   `<Card />` property
    -   `whitespaceAmount`: controls how much whitespace is displayed within the card subelements
-   `<CardContent />` (react flow) property
    -   `noFlexHeight`: changes the behaviour how the component uses the remaining space inside the Card element
-   `<Divider />` properties
    -   `width`: width of the horizontal rule
    -   `alignment`: horizontal alignment of the horizontal rule
-   `<EdgeDefault />` (react flow) properties
    -   `strokeType`: overwrites the default style how the edge stroke is displayed
    -   `intent`: visual feedback about the current state of the edge
    -   `highlightColor`: color(s) of used highlights to mark the edge
-   `<Markdown />` property
    -   `linkTargetName`: browser target name to open links from the Markdown content
-   `<MultiSelect />` property
    -   `requestDelay`: To delay requests on query changes and only fire the most recent request.
-   `<NodeContent />` (react flow) properties
    -   `leftElement`: any element that should be displayed before the node label
    -   `labelSubline`: displayed under the label in the header
    -   `fullWidth`: stretches the node to the full available width, e.g. when used outside React Flow context
    -   `enlargeHeader`: increase hight of header
    -   `border`: property to overwrite default styles
    -   `intent`: visual feedback about the current state of the node
    -   `highlightColor`: color(s) of used highlights to mark the node, together with `intent` it replaces `highlightedState`
-   `<Pagination />` property
    -   `hideBorders`: element is displayed without dividing borders
-   `<Tag />` property
    -   add support for `intent` property
-   `<TextField />` and `<TextArea />` property
    -   `invisibleCharacterWarning`: callback to warn of invisible, hard to spot characters in the input text.
    -   `intent`: state of the text field
-   `<ReactFlow />` property
    -   `scrollOnDrag`: Support to scroll the pane when going beyond the pane borders on all drag and connection operations.
-   `<SilkActivityControl />` property
    -   `executePrioritized` that is executed when the 'start prioritized' button is clicked while an activity is waiting for execution.
-   `<WhiteSpaceContainer />` property
    -   `linebreakForced`: insert line breaks within an otherwise unbreakable string to prevent text from overflowing the container

### Changed

-   use option `--outputCss` for `yarn compile-scss` to get the transpiled CSS echoed out
-   upgrade to Carbon icons v11
-   switch from `carbon-components` to `@carbon/styles`
-   `<GridRow />` property `dontWrapColumns=true` only works for grids on medium sized and larger viewports
-   `<NodeContent />` animation is now displayed on the border, not by a pulsing shadow anymore
-   `<NodeDefault />`, `<NodeContent />` and `<HandleDefault />` support now React Flow 9 and 10

### Fixed

-   `<WorkspaceContent />`: do not prevent wrapping the columns of the included grid
-   `<SingleLineCodeEditor />`: Convert multi-line initial value to a single line value.
-   `<MenuItem />`: do not display empty icon wrapper.
-   `<MultiSelect />`: Requests e.g. on slow networks could get mixed up, resulting in not showing the most recent results.

### Deprecated

-   `<Grid />` property `fullWidth` is now deprecated as grids are always used for the full viewport width
-   `<NodeContent />` property `highlightedState` is replaced by `intent` and `highlightColor` and should not be used anymore
-   `<CardHeader />` properties `densityHigh` and `hasSpacing` are now deprecated, use `Card.whitespaceAmount` now
-   `<TextField />` properties `hasStatePrimary`, `hasStateSuccess`, `hasStateWarning` and `hasStateDanger` are now deprecated, use `intent` now

## [23.0.0] - 2022-11-18

### Added

-   `<CodeEditor />` element based on `CodeMirror` library, supporting Markdown, Python, Sparql, SQL, Turtle and XML syntax
-   `<HoverToggler />` element that allows to switch elements when hovered over.
-   `<InteractionGate />` element that can wrap content that need to be blocked from user interactions, it also has options to display a spinner as overlay
-   `<Tree />` component
-   `<TabPanel />` component that can be used if `<Tabs />` is used in uncontrolled mode.
-   `<ReactFlowMarkers />` custom markers for ReactFlow edges, currently one new marker `arrowClosed-inverse` available
-   `<StickyNoteNode />`, usable by `stickynote` type in react flow editors for workflows and linking rules
-   `CssCustomProperties` and `getColorConfiguration` utilities can be used to exchange color configurations between SCSS and JS
-   `decideContrastColorValue` method to get a second color related to the lightness of the testes input color
-   `<SimpleDialog />`: properties `showFullScreenToggler` and `startInFullScreenMode`
-   `<EdgeDefault />`: new properties for the edge data
    -   `markerStart` allows to add a marker to the edge starting point
    -   `inversePath` allows to inverse the edge direction
    -   `renderLabel` function to render fully custom edge label including any ReactNode
-   `<NodeContent />`: property `footerContent` to add footer content to a react flow node
-   `<AutoSuggestion>`: properties `autoCompletionRequestDelay` and `validationRequestDelay`, to configure the delay when a request is sent after nothing is typed in anymore.
-   `<FieldItemRow`: property `justifyItemWidths` to display all children using equal width inside the row
-   `<BreadcrumbList />`: properties `ignoreOverflow` and `latenOverflow`, that can be used to implement a second overflow strategy beside BlueprintJS overflow list, for example in case the overflow list leads to re-rendering loops
-   `<Spinner />`: `showLocalBackdrop` property to include backdrop behind spinner making the background less visible
-   `<ContextMenu />`: `disabled` property that disables the button to open the menu.
-   `<Tooltip />`: properties `markdownEnabler` and `markdownProps` to enable better formatted tooltips with options for line breaks, etc.
-   `<AutoCompleteField />`: `onlyDropdownWithQuery` property to prevent dropdown as long as the input field is empty
-   large addition to the Storybook, we almost doubled available components and stories

### Fixed

-   allow children of `<Accordion />` item to get calculated based on their DOM sizes
-   add borders to CodeMirror editor area and include display of focused state
-   GUI elements library can be now used easier in applications because it does not force usage of SCSS modules via JS/Webpack4
-   fixed ReactFlow stories re-rerender on configuration change
-   fix used font family and layout of `<AutoSuggestion />` element, and justify it with the other single line text inputs
-   fix condition to include the class name of a `<TagList />` and set maximum width for the items
-   fixed `<MultiSelect />` to correctly update created items that are selected while still maintaining a cache of all newly created items
-   do not change cursor to pointer by default on tooltip targets

### Changed

-   move style imports of CodeMirror layout to `extensions`
-   color configurations for react flow editor are not exported as modules anymore, they need to be fetched by `getColorConfiguration` method in JS directly
-   BlueprintJS was upgraded to a recent v4
    -   elements were also upgraded to usage of `Popover2`, `Tooltip2`, `Select2`, `MultiSelect2` and `Breadcrumbs2`
    -   this comes also with a necessary switch from `node-sass` to `sass` package, a javascript port from the original dart sass library, see migration notes to update your build process
-   `<TextField />` and `<AutoCompleteField />` now include a `title` attribute on the natively used `input` element to show the value if it is `disabled` or `readOnly`
-   flashing color regarding the intent state of a `<TextField />`
-   `<AutoCompleteField />`: Add 'hasBackDrop' parameter to use a backdrop for its popover in order for outside clicks to always close the popover. Default: false

### Migration notes

-   old `{ colors }` imports for `cmem/react-flow/configurations/*` do not keep working anymore, use `getColorConfiguration` method now
-   `<IconButton>`: `tooltipOpenDelay` was removed, use `tooltipProps.hoverOpenDelay` directly
-   `<FieldItem>`: `labelAttributes` was renamed to `labelProps`
-   `<MenuItem>`: this element now extends directly the Blueprint element, so `internalProps` was removed, use properties directly on `MenuItem`
-   `<AutoCompleteField>`: `popoverProps` was renamed to `contextOverlayProps`
-   `<Button>`: `tooltipProperties` was renamed to `tooltipProps`
-   `<ContextMenu>`: use `contextOverlayProps` to route properties to the overlay element
-   `<Icon>`: `tooltipProperties` was renamed to `tooltipProps`, `tooltipOpenDelay` was removed, use `tooltipProps.hoverOpenDelay` directly
-   `<Label>`: `tooltipProperties` was renamed to `tooltipProps`
-   `<MultiSelect>`: `popoverProps` was renamed to `contextOverlayProps`
-   `<Select>`: `popoverProps` was renamed to `contextOverlayProps`
-   `<Tooltip>`: this element now extends directly the Blueprint element, so `tolltipProps` was removed, use properties directly on `Tooltip`
-   `<BreadcrumbItem>`: `IBreadcrumbItemProps` interface was renamed to `BreadcrumbItemProps`
-   `BreadcrumbList`: `IBreadcrumbListProps` interface was renamed to `BreadcrumbListProps`

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

-   `MultiSelect` element that let select multiple options and adding new elements.
-   `ReactFlow` element with `configuration` property to load it with pre-set configurations for node and edge types
-   `Tab` element got new property for `backgroundColor`
-   Support highlighting of div elements via `eccgui-container--highlighted` class
-   Allow DefaultNode's execution buttons to read and adjust state of the node content in order for them to have effects on the node content
-   `letPassWheelEvents` property for `<NodeContent />` elements to enable/disable mouse wheel event propagation to the react flow zoom pane
-   `scrollinOnFocus` property for `<Card />` element, enables card to scroll controlled into the viewport
-   `slideOutOfNode` property for `<NodeContentExtension />` element, by default it is disabled
-   `labelWrapper` and `hasSpacing` properties for `<ActivityControlWidget />` to enable more control over its display from outside
-   `noScrollbarsOnChildren` property for `<HtmlContentBlock />` to allow merging scroll bars of both axes

### Fixed

-   text color of button inside `<Notification />` element is not changed when it has an explicit intent state
-   use correct import paths in ESM distribution exports
-   correct alignment of children in vertical toolbar

### Changed

-   Allow `round` attribute in `Tag` component
-   Allow tooltips on buttons only if they do not set on `loading` state
-   Improve routing calculations of `<ReactFlow />` edges reagrding our current use cases
-   Expose `<NodeTools />` menu API to ouside elements
-   `<ActivityExecutionErrorReportModal />` now offers always the option to display it in fullscreen size

### Deprecated

-   deprecated `<Tabs/>` interface for tab items was removed, if necessary it can be used now from `legacy-repelacements` imports

## [22.0.1] - 2022-04-11

### Fixed

-   make used package version more stable, re-allowing also a yarn lock file
-   correct documentation about package registry

## [22.0.0] - 2022-04-08

### Added

-   `Tag` element got new property for `backgroundColor`
-   Styles for footnotes and task lists, rendered by Markdown GFM parser.
-   React-Flow `NodeContent` element can now be extented by `contentExtension` property containing a `NodeContentExtension` element.

### Fixed

-   Add missing import to `components/Spinner/Spinner.tsx`.
-   Add bottom white space in tables in content block elements.
-   `fullWidth` on/off display of `TextField` is now working like expected

### Changed

-   `TextField` elements are using `fullWidth=true` by default
-   `SearchField` uses now by default `"operation-search"` as `leftIcon`

### Deprecated

-   `SimpleDialog` element now uses `intent` property instead of `intentClassName`

## [21.11.1] 2021-11-24

### Added

-   Changelog documentation
-   Readme project overview

## 21.11

### Added

-   Iframe and IframeModal basic elements
-   Support for special components shared between applications of the eccenca Corporate Memory GUI
    -   ActivityControl widget
    -   ContentBlobToggler component
    -   Markdown parser widget
-   Support animated NodeDefault shadows to visualize activities
-   Height of NodeDefault can be aligned to number of handles
-   React-Flow Minipmap can be used for navigation on canvas
-   Support more icons
-   Support intent states for Icon

### Changed

-   ApplicationContainer is not based on Carbon anymore
    -   sidenav expansion state must be managed outside of that element now
-   OverviewItemActions can be shown only when OverviewItem is hovered
-   Rail naviagtion is openen just after a short delay to prevent openeing on wrong hover actions
-   Use own property to hide overflow content in ToolbarSection

### Fixed

-   Stabilize icon dimensions
-   Small font size amrkup now works inside HTML content block
-   Stabilize tabs
-   Do not ignore size and stroke properties for Spinner

## 21.06

### Added

-   First release, it provides:
    -   Basic GUI elements based on BlueprintJS and IBM Carbon Design System
        -   Accordion
        -   Application layout
        -   AutocompleteField
        -   Breadcrumb
        -   Button
        -   Card
        -   Checkbox
        -   ContextOverlay
        -   Dialog
        -   Form
        -   Grid
        -   Icon
        -   Intent
        -   Label
        -   Link
        -   Menu
        -   Notification
        -   NumericInput
        -   OverviewItem
        -   Pagination
        -   PropertyValuePair
        -   RadioButton
        -   Separation
        -   SimpleTable
        -   Spinner
        -   Structure
        -   Switch
        -   Tabs
        -   Tag
        -   TagInput
        -   TextField
        -   Toolbar
        -   Tooltip
        -   Typography
        -   Workspace view parts
    -   Extensions for React-Flow
        -   EdgeDefault
        -   EdgeStep
        -   EdgeTools
        -   HandleContent
        -   HandleDefault
        -   NodeDefault
        -   NodeTools
