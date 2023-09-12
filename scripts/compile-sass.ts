import * as sass from "sass";
import tildeImporter from "node-sass-package-importer";
import yargs from "yargs";
import sassRenderSyncConfig from "./sassConfig";

const args = yargs(process.argv.slice(2)).argv as any;

const styles = sass.renderSync({
    importer: tildeImporter(),
    ...sassRenderSyncConfig,
    file: "src/index.scss",
    includePaths: ["node_modules"], // Carbon does not use tilde import syntax
});

if (args.outputCss) {
    console.log(styles.css.toString());
}
