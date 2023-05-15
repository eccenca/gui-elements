import { ClassNames as IntentClassNames } from "./common/Intent";
import * as TypographyClassNames from "./components/Typography/classnames";
import * as LegacyReplacements from "./legacy-replacements";

const ClassNames = {
    Typography: TypographyClassNames,
    Intent: IntentClassNames,
};
// @deprecated use `ClassNames`
const HelperClasses = ClassNames;

export * from "./common";
export * from "./components";
export * from "./extensions";
export * from "./cmem";

export {
    ClassNames,
    HelperClasses,
    LegacyReplacements,
};
