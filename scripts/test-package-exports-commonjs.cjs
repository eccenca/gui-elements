const assert = require("node:assert/strict");

const guiElements = require("@eccenca/gui-elements");

assert.ok("Button" in guiElements, "The CommonJS root export must expose gui-elements components");
