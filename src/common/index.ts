import { openInNewTab } from "./utils/openInNewTab";
import decideContrastColorValue from "./utils/colorDecideContrastvalue";
import getColorConfiguration from "./utils/getColorConfiguration";
import { invisibleZeroWidthCharacters } from "./utils/characters";

export const utils = {
    openInNewTab,
    decideContrastColorValue,
    getColorConfiguration,
    invisibleZeroWidthCharacters,
}
// @deprecated use `utils`
export const Utilities = utils;
