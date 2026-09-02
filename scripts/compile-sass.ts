import * as fs from "fs";
import tildeImporter from "node-sass-package-importer";
import * as path from "path";
import * as sass from "sass";
import yargs from "yargs";

import sassRenderSyncConfig from "./sassConfig";
import { silenceDeprecations } from "./sassDeprecationConfig";

const args = yargs(process.argv.slice(2)).argv as any;

/**
 * Returns the directory a package was installed into, or `undefined` if it cannot be found.
 * The `node_modules` chain of the resolver is walked directly instead of resolving the
 * `package.json` of the package, because a package is free to hide that file behind its
 * `exports` map, which would let `require.resolve()` fail with `ERR_PACKAGE_PATH_NOT_EXPORTED`.
 * Symbolic links are resolved, so that the real location is used, e.g. the store directory of pnpm.
 */
const packageDirectory = (packageName: string) => {
    for (const searchPath of require.resolve.paths(packageName) ?? []) {
        const candidate = path.join(searchPath, ...packageName.split("/"));
        if (fs.existsSync(path.join(candidate, "package.json"))) return fs.realpathSync(candidate);
    }
    return undefined;
};

/**
 * Returns the dependency root a package was installed into, i.e. the `node_modules` directory
 * holding it. The number of levels to climb is taken from the package name, this way scoped
 * (`@scope/name`) and plain (`name`) packages are both handled correctly.
 */
const dependencyRoot = (packageName: string) => {
    const directory = packageDirectory(packageName);
    return directory === undefined ? undefined : path.resolve(directory, ...packageName.split("/").map(() => ".."));
};

// Imports without tilde syntax are not handled by the importer below, sass resolves them relative
// to the importing file and via these include paths. `@blueprintjs/core` and `@carbon/react` both
// use them internally to reach their sibling packages, e.g. `@blueprintjs/colors` or
// `@carbon/styles`. Their dependency roots are looked up separately because the packages do not
// need to share one, e.g. if only one of them is hoisted into a parent workspace. The local
// `node_modules` is kept as a fallback, it is also used alone if a dependency root cannot be
// determined. All paths are absolute, so that duplicates of the same directory can be removed.
const includePaths = [
    ...new Set(
        [dependencyRoot("@blueprintjs/core"), dependencyRoot("@carbon/react"), path.resolve("node_modules")].filter(
            (includePath): includePath is string => includePath !== undefined,
        ),
    ),
];

const styles = sass.renderSync({
    importer: tildeImporter(),
    ...sassRenderSyncConfig,
    silenceDeprecations: [...silenceDeprecations, "legacy-js-api"] as sass.DeprecationOrId[],
    file: "src/index.scss",
    includePaths,
});

if (args.outputCss) {
    // eslint-disable-next-line no-console
    console.log(styles.css.toString());
}
