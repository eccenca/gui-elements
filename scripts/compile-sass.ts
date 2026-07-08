import tildeImporter from "node-sass-package-importer";
import * as sass from "sass";
import yargs from "yargs";

import sassRenderSyncConfig from "./sassConfig";
import { silenceDeprecations } from "./sassDeprecationConfig"

const args = yargs(process.argv.slice(2)).argv as any;

const styles = sass.renderSync({
    importer: tildeImporter(),
    ...sassRenderSyncConfig,
    silenceDeprecations: silenceDeprecations as sass.DeprecationOrId[],
    file: "src/index.scss",
    includePaths: ["node_modules"], // Carbon does not use tilde import syntax
});

if (args.outputCss) {
    console.log(styles.css.toString());
}
