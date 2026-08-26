import tildeImporter from "node-sass-package-importer";
import * as path from "path";
import * as sass from "sass";
import yargs from "yargs";

import sassRenderSyncConfig from "./sassConfig";
import { silenceDeprecations } from "./sassDeprecationConfig";

const args = yargs(process.argv.slice(2)).argv as any;

const styles = sass.renderSync({
    importer: tildeImporter(),
    ...sassRenderSyncConfig,
    silenceDeprecations: [...silenceDeprecations, "legacy-js-api"] as sass.DeprecationOrId[],
    file: "src/index.scss",
    // Resolve non-tilde imports from the effective workspace dependency root, including when
    // dependencies are hoisted into a parent workspace.
    includePaths: [path.resolve(path.dirname(require.resolve("@blueprintjs/core/package.json")), "../..")],
});

if (args.outputCss) {
    console.log(styles.css.toString());
}
