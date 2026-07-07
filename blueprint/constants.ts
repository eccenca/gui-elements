/**
 * @deprecated Historical Blueprint deep-import shim
 * (`@eccenca/gui-elements/blueprint/constants`).
 *
 * This module previously re-exported constants from `@blueprintjs/core`. It is
 * now foundation-independent (no `@blueprintjs` runtime import) and only kept
 * for backwards compatibility with existing deep imports. Every exported name
 * and every runtime string value is preserved.
 *
 * Prefer importing intent values from `@eccenca/gui-elements` or
 * `@eccenca/gui-elements/src/common/Intent` instead.
 */
import { DefinitionsBlueprint } from "../src/common/Intent";

/**
 * @deprecated Placement/position constants. Structurally identical to the
 * historical Blueprint `Position` object (same keys, same string values).
 */
export const Position = {
    BOTTOM: "bottom",
    BOTTOM_LEFT: "bottom-left",
    BOTTOM_RIGHT: "bottom-right",
    LEFT: "left",
    LEFT_BOTTOM: "left-bottom",
    LEFT_TOP: "left-top",
    RIGHT: "right",
    RIGHT_BOTTOM: "right-bottom",
    RIGHT_TOP: "right-top",
    TOP: "top",
    TOP_LEFT: "top-left",
    TOP_RIGHT: "top-right",
} as const;

/**
 * @deprecated The four basic intents (historical Blueprint `Intent` values).
 * Re-exported from `../src/common/Intent` so the runtime values stay identical.
 */
export const Intent = DefinitionsBlueprint;
