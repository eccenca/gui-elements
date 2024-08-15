import { Classes as BlueprintClasses } from "@blueprintjs/core";

import { ClassNames as IntentClassNames } from "./common/Intent";
import * as Skeleton from "./components/Skeleton/classnames";
import * as TypographyClassNames from "./components/Typography/classnames";
import * as LegacyReplacements from "./legacy-replacements";

const ClassNames = {
    Blueprint: BlueprintClasses,
    Intent: IntentClassNames,
    Skeleton,
    Typography: TypographyClassNames,
};
// @deprecated use `ClassNames`
const HelperClasses = ClassNames;

export * from "./configuration/constants";
export * from "./common";
export * from "./components";
export * from "./extensions";
export * from "./cmem";

export { ClassNames, HelperClasses, LegacyReplacements };
