import { Position } from "react-flow-renderer";

import { EdgeDefaultProps } from "./EdgeDefault";
import { EdgeStepProps } from "./EdgeStep";
import { getSmoothStepPath } from "./getSmoothStepPath";

interface EdgePositionCorrectionProps
    extends Omit<EdgeDefaultProps, "id" | "source" | "target" | "drawSvgPath" | "data"> {
    correctionLength?: number;
    correctionRadius?: number;
}

const posCorrectionEdge = ({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    correctionLength = 7,
    correctionRadius = 7,
}: EdgePositionCorrectionProps) => {
    let newSourceX = sourceX;
    let newSourceY = sourceY;
    let newTargetX = targetX;
    let newTargetY = targetY;
    let startCommandCorrection = `M ${sourceX},${sourceY} `;
    let endCommandCorrection = ``;

    if (sourcePosition === Position.Left && sourceX < targetX) {
        newSourceX = newSourceX - 2 * correctionLength;
        if (sourceY < targetY) {
            newSourceY = sourceY + correctionRadius;
            startCommandCorrection =
                startCommandCorrection +
                ` L ${
                    newSourceX + correctionRadius
                },${sourceY} A ${correctionRadius} ${correctionRadius} ${90} ${0} ${0} `;
        } else {
            newSourceY = sourceY - correctionRadius;
            startCommandCorrection =
                startCommandCorrection +
                ` L ${
                    newSourceX + correctionRadius
                },${sourceY} A ${correctionRadius} ${correctionRadius} ${90} ${0} ${1} `;
        }
    }

    if (sourcePosition === Position.Right && sourceX > targetX) {
        newSourceX =
            targetPosition === Position.Right
                ? newSourceX + correctionLength + correctionRadius
                : newSourceX + correctionLength;
        if (sourceY < targetY) {
            newSourceY = sourceY + correctionRadius;
            startCommandCorrection =
                startCommandCorrection +
                ` L ${
                    newSourceX - correctionRadius
                },${sourceY} A ${correctionRadius} ${correctionRadius} ${90} ${0} ${1} `;
        } else {
            newSourceY = sourceY - correctionRadius;
            startCommandCorrection =
                startCommandCorrection +
                ` L ${
                    newSourceX - correctionRadius
                },${sourceY} A ${correctionRadius} ${correctionRadius} ${90} ${0} ${0} `;
        }
    }

    if (targetPosition === Position.Left && sourceX > targetX) {
        newTargetX = newTargetX - 3 * correctionLength;
        if (sourceY < targetY) {
            newTargetY = targetY - correctionRadius;
            endCommandCorrection = ` A ${correctionRadius} ${correctionRadius} ${90} ${0} ${0} ${
                newTargetX + correctionRadius
            },${targetY} L ${targetX},${targetY}`;
        } else {
            newTargetY = targetY + correctionRadius;
            endCommandCorrection = ` A ${correctionRadius} ${correctionRadius} ${90} ${0} ${1} ${
                newTargetX + correctionRadius
            },${targetY} L ${targetX},${targetY}`;
        }
    }

    if (targetPosition === Position.Right && sourceX < targetX) {
        newTargetX = newTargetX + 3 * correctionLength;
        if (sourceY < targetY) {
            newTargetY = targetY - correctionRadius;
            endCommandCorrection = ` A ${correctionRadius} ${correctionRadius} ${90} ${0} ${1} ${
                newTargetX - correctionRadius
            },${targetY} L ${targetX},${targetY}`;
        } else {
            newTargetY = targetY + correctionRadius;
            endCommandCorrection = ` A ${correctionRadius} ${correctionRadius} ${90} ${0} ${0} ${
                newTargetX - correctionRadius
            },${targetY} L ${targetX},${targetY}`;
        }
    }

    return {
        newSourceX,
        newSourceY,
        newTargetX,
        newTargetY,
        startCommandCorrection,
        endCommandCorrection,
    };
};

interface PathCommandCorrectionProps {
    pathCommand: string;
    startCorrection: string;
    endCorrection: string;
}

const pathCommandCorrection = ({ pathCommand, startCorrection, endCorrection }: PathCommandCorrectionProps) => {
    return startCorrection + pathCommand.substring(1) + endCorrection;
};

export const drawEdgeStraight = ({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
}: EdgeDefaultProps) => {
    const corrections = posCorrectionEdge({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        correctionRadius: 0,
    });

    const pathCommand = `M ${corrections.newSourceX},${corrections.newSourceY}L ${corrections.newTargetX},${corrections.newTargetY}`;

    return pathCommandCorrection({
        pathCommand,
        startCorrection: corrections.startCommandCorrection,
        endCorrection: corrections.endCommandCorrection,
    });
};

export const drawEdgeStep = ({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    data = {},
}: EdgeStepProps) => {
    const corrections = posCorrectionEdge({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        correctionLength: data.stepCornerRadius || 7,
        correctionRadius: data.stepCornerRadius || 7,
    });

    const pathCommand = getSmoothStepPath({
        sourceX: corrections.newSourceX,
        sourceY: corrections.newSourceY,
        sourcePosition,
        targetX: corrections.newTargetX,
        targetY: corrections.newTargetY,
        targetPosition,
        borderRadius: data.stepCornerRadius || 7,
    });

    return pathCommandCorrection({
        pathCommand,
        startCorrection: corrections.startCommandCorrection,
        endCorrection: corrections.endCommandCorrection,
    });
};
