import { EdgeDefaultProps } from "./EdgeDefault";
import { EdgeStepProps } from "./EdgeStep";
import { getSmoothStepPath } from "react-flow-renderer";

export const drawEdgeStraight = ({
    sourceX,
    sourceY,
    targetX,
    targetY,
}: EdgeDefaultProps) => {
    return `M ${sourceX},${sourceY}L ${targetX},${targetY}`;
}

export const drawEdgeStep = ({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    data = {},
}: EdgeStepProps) => {
    return getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: data.stepCornerRadius || 10
    });
}
