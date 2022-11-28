import * as sass from "sass";
import tildeImporter from "node-sass-package-importer";
import sassRenderSyncConfig from "./sassConfig";

const styles = sass.renderSync({
    importer: tildeImporter(),
    ...sassRenderSyncConfig,
    file: "src/index.scss",
    includePaths: ["node_modules"], // Carbon does not use tilde import syntax
});

console.log(styles.css.toString());
