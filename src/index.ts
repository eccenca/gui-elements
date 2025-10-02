import { Classes as BlueprintClasses } from "@blueprintjs/core";

import { ClassNames as IntentClassNames } from "./common/Intent";
import * as Skeleton from "./components/Skeleton/classnames";
import * as TypographyClassNames from "./components/Typography/classnames";

const ClassNames = {
    Blueprint: BlueprintClasses,
    Intent: IntentClassNames,
    Skeleton,
    Typography: TypographyClassNames,
};

export * from "./configuration/constants";
export * from "./common";
export * from "./components";
export * from "./extensions";
export * from "./cmem";

export { ClassNames };
