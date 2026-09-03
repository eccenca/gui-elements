import { Classes as BlueprintClasses } from "@blueprintjs/core";

import { helperClasses as reactFlowHelperClasses } from "./cmem/react-flow/ReactFlow/constants";
import { ClassNames as IntentClassNames } from "./common/Intent";
import * as Skeleton from "./components/Skeleton/classnames";
import * as TypographyClassNames from "./components/Typography/classnames";

const ClassNames = {
    Blueprint: BlueprintClasses,
    Intent: IntentClassNames,
    Skeleton,
    Typography: TypographyClassNames,
    ReactFlow: reactFlowHelperClasses,
};

/** @deprecated (v27) use `ClassNames.ReactFlow.preventAllActions` */
const preventReactFlowActionsClasses = reactFlowHelperClasses.preventAllActions;

export * from "./configuration/constants";
export * from "./common";
export * from "./components";
export * from "./extensions";
export * from "./cmem";

export { ClassNames, preventReactFlowActionsClasses };
