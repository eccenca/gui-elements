import React, { memo } from 'react';
import {
    EdgeProps as ReactFlowEdgeProps,
} from "react-flow-renderer/dist/types";
import {
    getMarkerEnd,
    getEdgeCenter,
    EdgeText,
} from "react-flow-renderer";
import { drawEdgeStraight} from "./utils";

export interface EdgeDefaultDataProps {
    pathGlowWidth?: number;
}

export interface EdgeDefaultProps extends ReactFlowEdgeProps {
    data?: EdgeDefaultDataProps,
    drawSvgPath?: (edge: ReactFlowEdgeProps) => string;
}

export const EdgeDefault = memo(
    (edge: EdgeDefaultProps) => {
        const {
            data = {},
            drawSvgPath = drawEdgeStraight,
            ...edgeOriginalProperties
        } = edge;
        const {
            pathGlowWidth = 10,
        } = data;

        const pathDisplay = drawSvgPath({...edgeOriginalProperties, data});
        const markerEnd = getMarkerEnd(
            edgeOriginalProperties.arrowHeadType,
            edgeOriginalProperties.markerEndId
        );
        const edgeCenter = getEdgeCenter({
            sourceX: edgeOriginalProperties.sourceX,
            sourceY: edgeOriginalProperties.sourceY,
            targetX: edgeOriginalProperties.targetX,
            targetY: edgeOriginalProperties.targetY,
        });

        const edgeLabel = edgeOriginalProperties.label ? (
            <EdgeText
                x={edgeCenter[0]}
                y={edgeCenter[1]}
                label={edgeOriginalProperties.label}
                labelStyle={edgeOriginalProperties.labelStyle}
                labelShowBg={edgeOriginalProperties.labelShowBg}
                labelBgStyle={edgeOriginalProperties.labelBgStyle}
                labelBgPadding={edgeOriginalProperties.labelBgPadding || [5, 5]}
                labelBgBorderRadius={edgeOriginalProperties.labelBgBorderRadius || 3}
            />
        ) : null;

        return (
            <>
                { pathGlowWidth && (
                    <path
                        d={pathDisplay}
                        className="react-flow__edge-path-glow"
                        stroke-width={pathGlowWidth}
                        style={edgeOriginalProperties.style}
                    />
                )}
                <path
                    d={pathDisplay}
                    className="react-flow__edge-path"
                    style={edgeOriginalProperties.style}
                    markerEnd={markerEnd}
                />
                { edgeLabel }
            </>
        );
    }
);
