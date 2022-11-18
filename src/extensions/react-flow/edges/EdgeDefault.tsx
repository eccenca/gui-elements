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
    /**
     * Size of the "glow" effect when the edge is hovered.
     */
    pathGlowWidth?: number;
    /*
     * Direction of the SVG path is inversed.
     * This is important for the placement of the markers and the animation movement.
     */
    inversePath?: boolean;
    /**
     * Reference linnk to the SVG marker used for the start of the edge
     */
    markerStart?: string;
    /**
     * Callback handler that returns a React element used as edge title.
     */
    renderLabel?: (edgeCenter: [number, number, number, number]) => React.ReactNode;
}

export interface EdgeDefaultProps extends ReactFlowEdgeProps {
    /**
     * Defining content and markers for the edge.
     */
    data?: EdgeDefaultDataProps,
    /**
     * Callback handler that returns a SVG path as string to define how the edge is rendered.
     */
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
            markerStart
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

        const edgeLabel = data.renderLabel?.(edgeCenter) ?? (edgeOriginalProperties.label ? (
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
        ) : null);

        const edgeStyle = edgeOriginalProperties.style ?? {};
        return (
            <g style={{...edgeStyle, color: edgeStyle.color || edgeStyle.stroke}}>
                { pathGlowWidth && (
                    <path
                        d={pathDisplay}
                        className="react-flow__edge-path-glow"
                        strokeWidth={pathGlowWidth}
                    />
                )}
                <path
                    d={pathDisplay}
                    className="react-flow__edge-path"
                    markerStart={markerStart}
                    markerEnd={markerEnd}
                />
                { edgeLabel }
            </g>
        );
    }
);
