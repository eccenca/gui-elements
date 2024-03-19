import React, { memo } from "react";

import { EdgeDefault, EdgeDefaultDataProps, EdgeDefaultProps } from "./EdgeDefault";
import { drawEdgeStep } from "./utils";

interface EdgeStepDataProps extends EdgeDefaultDataProps {
    stepCornerRadius?: number;
}

export interface EdgeStepProps extends EdgeDefaultProps {
    data?: EdgeStepDataProps;
}

export const EdgeStep = memo((edge: EdgeStepProps) => {
    return <EdgeDefault {...edge} drawSvgPath={drawEdgeStep} />;
});
