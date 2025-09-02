import React from "react";
import {
    ConnectionLineComponentProps,
    ConnectionLineType,
} from "@xyflow/react";
import { EdgeStraight, EdgeStep, EdgeBezier, EdgeDefaultV12Props } from "./../index";

import { CLASSPREFIX as eccgui } from "../../../configuration/constants";

export const EdgeNew = (edgeNewProps: ConnectionLineComponentProps) => {

    const {
        connectionLineType,
        fromX,
        fromY,
        toX,
        toY,
        connectionStatus,
        fromPosition,
        toPosition,
    } = edgeNewProps;

    let EdgeType;

    switch(connectionLineType) {
        case ConnectionLineType.Step:
        case ConnectionLineType.SmoothStep:
            EdgeType = EdgeStep;
            break;
        case ConnectionLineType.Bezier:
        case ConnectionLineType.SimpleBezier:
            EdgeType = EdgeBezier;
            break;
        default:
            EdgeType = EdgeStraight;
    }

    return <EdgeType {...{
        sourceX: fromX,
        sourceY: fromY,
        targetX: toX,
        targetY: toY,
        sourcePosition: fromPosition,
        targetPosition: toPosition,
        data: {
            strokeType: !connectionStatus ? "dashed" : undefined,
            edgeSvgProps: {className: `${eccgui}-graphviz__edge--dragged`},
            intent: connectionStatus === "valid" ? "success" : connectionStatus === "invalid" ? "warning" : "accent"
        },
    } as EdgeDefaultV12Props} />;
};

