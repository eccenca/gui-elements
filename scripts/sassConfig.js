import sass from "sass";
// const sass = require("sass");

const functions = {
    "svg-icon($path, $selectors: null)": function (_path, _selectors) {
        return new sass.SassString("unset", { quotes: false });
    },
};
const sassRenderSyncConfig = {
    quietDeps: true,
    functions,
};

export default sassRenderSyncConfig;
// module.exports = ;
