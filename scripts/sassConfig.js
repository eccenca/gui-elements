const sass = require("sass");

const functions = {
    'svg-icon($path, $selectors: null)': function(_path, _selectors) {
        return new sass.SassString("unset");
    },
};
const sassRenderSyncConfig = {
    quietDeps: true,
    functions,
};

module.exports = sassRenderSyncConfig;
