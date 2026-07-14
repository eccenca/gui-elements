import { ClassNames as IntentClassNames } from "./common/Intent";
import * as Skeleton from "./components/atoms/Skeleton/classnames";
import * as TypographyClassNames from "./components/atoms/Typography/classnames";

// The former `ClassNames.Blueprint` no-op compatibility stub (post-Blueprint-removal) has been
// dropped — no call sites remained in any consumer. Only the foundation-independent members stay.
const ClassNames = {
    Intent: IntentClassNames,
    Skeleton,
    Typography: TypographyClassNames,
};

export * from "./configuration/constants";
export * from "./common";
export { cn } from "./common/utils/cn";
export * from "./components";
export * from "./extensions";
export * from "./cmem";
export * as shadcn from "./_shadcn";
export * as AiElements from "./components/organisms/AiElements";

export { ClassNames };
