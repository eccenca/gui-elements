import tildeImporter from "node-sass-package-importer";
import * as path from "path";
import * as sass from "sass";
import yargs from "yargs";

import sassRenderSyncConfig from "./sassConfig";
import { silenceDeprecations } from "./sassDeprecationConfig";

const args = yargs(process.argv.slice(2)).argv as any;

/**
 * Returns the dependency root a package was installed into, i.e. the `node_modules` directory
 * holding it. The number of levels to climb is taken from the package name, this way scoped
 * (`@scope/name`) and plain (`name`) packages are both handled correctly.
 */
const dependencyRoot = (packageName: string) =>
    path.resolve(
        path.dirname(require.resolve(`${packageName}/package.json`)),
        ...packageName.split("/").map(() => ".."),
    );

// Imports without tilde syntax are not handled by the importer below, sass resolves them relative
// to the importing file and via these include paths. `@blueprintjs/core` and `@carbon/react` both
// use them internally to reach their sibling packages, e.g. `@blueprintjs/colors` or
// `@carbon/styles`. Their dependency roots are looked up separately because the packages do not
// need to share one, e.g. if only one of them is hoisted into a parent workspace. The local
// `node_modules` is kept as a fallback. All paths are absolute, so that duplicates of the same
// directory can be removed.
const includePaths = [
    ...new Set([dependencyRoot("@blueprintjs/core"), dependencyRoot("@carbon/react"), path.resolve("node_modules")]),
];

const styles = sass.renderSync({
    importer: tildeImporter(),
    ...sassRenderSyncConfig,
    silenceDeprecations: [...silenceDeprecations, "legacy-js-api"] as sass.DeprecationOrId[],
    file: "src/index.scss",
    includePaths,
});

if (args.outputCss) {
    console.log(styles.css.toString());
}
