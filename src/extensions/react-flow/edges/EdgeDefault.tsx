import React, { memo } from "react";
import { EdgeText, getEdgeCenter, getMarkerEnd } from "react-flow-renderer";
import { EdgeProps as ReactFlowEdgeProps } from "react-flow-renderer/dist/types";

import { intentClassName, IntentTypes } from "../../../common/Intent";
import { CLASSPREFIX as eccgui } from "../../../configuration/constants";

import { nodeContentUtils } from "./../nodes/NodeContent";
import { NodeHighlightColor } from "./../nodes/sharedTypes";
import { drawEdgeStep, drawEdgeStraight } from "./utils";

export interface EdgeDefaultDataProps {
    /**
     * Overwrites the default style how the edge stroke is displayed.
     */
    strokeType?: "solid" | "dashed" | "dotted" | "double" | "doubledashed";
    /**
     * Feedback state of the node.
     */
    intent?: IntentTypes;
    /**
     * Set the color of used highlights to mark the edge.
     */
    highlightColor?: NodeHighlightColor | [NodeHighlightColor, NodeHighlightColor];
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
     * Reference link to the SVG marker used for the start of the edge
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
    data?: EdgeDefaultDataProps;
    /**
     * Callback handler that returns a SVG path as string to define how the edge is rendered.
     */
    drawSvgPath?: (edge: ReactFlowEdgeProps) => string;
}

export const EdgeDefault = memo((edge: EdgeDefaultProps) => {
    const { data = {}, drawSvgPath = drawEdgeStraight, ...edgeOriginalProperties } = edge;
    const { pathGlowWidth = 10, markerStart, strokeType, intent, highlightColor } = data;

    const pathDisplay = drawSvgPath({ ...edgeOriginalProperties, data });
    const markerEnd = getMarkerEnd(edgeOriginalProperties.arrowHeadType, edgeOriginalProperties.markerEndId);
    const edgeCenter = getEdgeCenter({
        sourceX: edgeOriginalProperties.sourceX,
        sourceY: edgeOriginalProperties.sourceY,
        targetX: edgeOriginalProperties.targetX,
        targetY: edgeOriginalProperties.targetY,
    });

    const edgeLabel =
        data.renderLabel?.(edgeCenter) ??
        (edgeOriginalProperties.label ? (
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
    const { highlightCustomPropertySettings } = nodeContentUtils.evaluateHighlightColors(
        "--edge-highlight",
        highlightColor
    );

    return (
        <g
            className={createEdgeDefaultClassName({ intent }, "")}
            style={{
                ...edgeStyle,
                color: edgeStyle.color || edgeStyle.stroke,
            }}
        >
            {highlightColor && (
                <path
                    d={pathDisplay}
                    className={createEdgeDefaultClassName({ highlightColor }, "react-flow__edge-path-highlight")}
                    strokeWidth={pathGlowWidth}
                    style={{
                        ...highlightCustomPropertySettings,
                    }}
                />
            )}
            {pathGlowWidth && (
                <path
                    d={pathDisplay}
                    className={createEdgeDefaultClassName({}, "react-flow__edge-path-glow")}
                    strokeWidth={pathGlowWidth}
                />
            )}
            <path
                d={pathDisplay}
                className={createEdgeDefaultClassName({ strokeType })}
                markerStart={markerStart}
                markerEnd={markerEnd}
            />
            {edgeLabel}
        </g>
    );
});

const createEdgeDefaultClassName = (
    { strokeType, intent, highlightColor }: EdgeDefaultDataProps,
    baseClass = "react-flow__edge-path"
) => {
    const { highlightClassNameSuffix } = nodeContentUtils.evaluateHighlightColors("--edge-highlight", highlightColor);
    return (
        baseClass +
        (strokeType ? ` ${baseClass}--stroke-${strokeType}` : "") +
        (intent ? ` ${intentClassName(intent)}` : "") +
        (highlightClassNameSuffix.length > 0
            ? highlightClassNameSuffix.map((highlight) => ` ${eccgui}-graphviz__edge--highlight-${highlight}`).join("")
            : "")
    );
};

export const edgeDefaultUtils = {
    createEdgeDefaultClassName,
    drawEdgeStep,
    drawEdgeStraight,
};
