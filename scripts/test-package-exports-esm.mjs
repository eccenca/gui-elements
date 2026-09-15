import assert from "node:assert/strict";

import * as guiElements from "@eccenca/gui-elements";

assert.ok("Button" in guiElements, "The ESM root export must expose gui-elements components");
