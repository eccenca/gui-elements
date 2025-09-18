import { invisibleZeroWidthCharacters } from "./utils/characters";
import { colorCalculateDistance } from "./utils/colorCalculateDistance";
import decideContrastColorValue from "./utils/colorDecideContrastvalue";
import { getEnabledColorsFromPalette, textToColorHash } from "./utils/colorHash";
import getColorConfiguration from "./utils/getColorConfiguration";
import { getScrollParent } from "./utils/getScrollParent";
import { getGlobalVar, setGlobalVar } from "./utils/globalVars";
import { openInNewTab } from "./utils/openInNewTab";
export type { IntentTypes as IntentBaseTypes } from "./Intent";

export const utils = {
    openInNewTab,
    decideContrastColorValue,
    colorCalculateDistance,
    getColorConfiguration,
    invisibleZeroWidthCharacters,
    getGlobalVar,
    setGlobalVar,
    getScrollParent,
    getEnabledColorsFromPalette,
    textToColorHash,
};
