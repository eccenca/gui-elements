import { ClassNames as IntentClassNames } from "./common/Intent";
import { openInNewTab } from "./common/utils/openInNewTab";
import decideContrastColorValue from "./common/utils/colorDecideContrastvalue";
import * as TypographyClassNames from "./components/Typography/classnames";
import * as LegacyReplacements from "./legacy-replacements";

const HelperClasses = {
    Typography: TypographyClassNames,
    Intent: IntentClassNames,
};

const Utilities = {
    openInNewTab,
    decideContrastColorValue,
};

export {
    HelperClasses,
    LegacyReplacements,
    Utilities,
};

export * from "./components";
export * from "./extensions";
export * from "./cmem";
