import { invisibleZeroWidthCharacters } from "./utils/characters";
import decideContrastColorValue from "./utils/colorDecideContrastvalue";
import getColorConfiguration from "./utils/getColorConfiguration";
import { getGlobalVar, setGlobalVar } from "./utils/globalVars";
import { openInNewTab } from "./utils/openInNewTab";

export const utils = {
    openInNewTab,
    decideContrastColorValue,
    getColorConfiguration,
    invisibleZeroWidthCharacters,
    getGlobalVar,
    setGlobalVar,
};
// @deprecated use `utils`
export const Utilities = utils;
