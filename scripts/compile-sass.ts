import * as sass from "sass";
import tildeImporter from "node-sass-package-importer";

export const svgIcon = (_iconpath: any, _selector: any) => { return new sass.SassString("unset"); };
export const functions = {
    'svg-icon($path, $selectors: null)': function(path, selectors) {
        return svgIcon(path, selectors)
    } as sass.LegacySyncFunction,
};
export const sassRenderSyncConfig = {
    importer: tildeImporter(),
    quietDeps: true,
    functions,
};

sass.renderSync({
    ...sassRenderSyncConfig,
    file: "src/index.scss",
});
