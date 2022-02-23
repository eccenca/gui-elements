# eccenca GUI elements

Collection of React elements based on [Palantir BlueprintJS](https://blueprintjs.com/) and [IBM Carbon](https://www.carbondesignsystem.com/), used for [eccenca Corporate Memory](https://eccenca.com/products/enterprise-knowledge-graph-platform-corporate-memory) applications.

## Usage

Currently it must be included as Git submodule to your projects.

* To include full SCSS styles add `@import "{your-gui-elements-path}/index";` into your main SCSS file.
* To include only the default configuration add `@import "{your-gui-elements-path}/src/configuration/variables;` into your SCSS file.

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
