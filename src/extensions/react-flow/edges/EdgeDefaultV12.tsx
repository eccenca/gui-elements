import { memo } from "react";
import React from "react";
import { BaseEdge, Edge, EdgeLabelRenderer, EdgeProps, EdgeText, getEdgeCenter, getStraightPath } from "@xyflow/react";

import { IntentTypes } from "../../../common/Intent";
import { nodeContentUtils } from "../nodes/NodeContent";
import { NodeHighlightColor } from "../nodes/sharedTypes";

import { edgeDefaultUtils } from "./EdgeDefault";

export type EdgeDefaultDataProps = Record<string, unknown> & {
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
    markerEnd?: string;
    /**
     * Callback handler that returns a React element used as edge title.
     */
    renderLabel?: (edgeCenter: [number, number, number, number]) => React.ReactNode;
    /**
     * Properties are forwarded to the internally used SVG `g` element.
     * Data attributes for test ids coud be included here.
     */
    edgeSvgProps?: React.SVGProps<SVGGElement>;
};

export const EdgeDefaultV12 = memo(
    ({
        id,
        sourceX,
        sourceY,
        targetX,
        targetY,
        label,
        labelStyle,
        labelShowBg,
        labelBgStyle,
        labelBgPadding = [5, 5],
        labelBgBorderRadius = 3,
        data = {},
        ...edgeOriginalProperties
    }: EdgeProps<Edge<EdgeDefaultDataProps>>) => {
        const { pathGlowWidth = 10, markerStart, markerEnd, highlightColor, renderLabel, edgeSvgProps, intent } = data;

        const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });
        const edgeCenter = getEdgeCenter({ sourceX, sourceY, targetX, targetY });

        // todo: replace?
        const renderedLabel =
            renderLabel?.(edgeCenter) ??
            (label ? (
                typeof label === "string" || typeof label === "number" ? (
                    <EdgeLabelRenderer>
                        <EdgeText
                            x={edgeCenter[0]}
                            y={edgeCenter[1]}
                            label={label}
                            labelStyle={labelStyle}
                            labelShowBg={labelShowBg}
                            labelBgStyle={labelBgStyle}
                            labelBgPadding={labelBgPadding}
                            labelBgBorderRadius={labelBgBorderRadius}
                        />
                    </EdgeLabelRenderer>
                ) : (
                    <EdgeLabelRenderer>
                        <foreignObject
                            x={edgeCenter[0] - 50}
                            y={edgeCenter[1] - 20}
                            width={100}
                            height={40}
                            requiredExtensions="http://www.w3.org/1999/xhtml"
                        >
                            <div style={{ padding: 4, background: "white", border: "1px solid #ccc" }}>{label}</div>
                        </foreignObject>
                    </EdgeLabelRenderer>
                )
            ) : null);

        const edgeStyle = edgeOriginalProperties.style ?? {};
        const { highlightCustomPropertySettings } = nodeContentUtils.evaluateHighlightColors(
            "--edge-highlight",
            highlightColor
        );

        return (
            <g
                {...edgeSvgProps}
                className={edgeDefaultUtils.createEdgeDefaultClassName({ intent }, edgeSvgProps?.className ?? "")}
                style={{
                    ...edgeSvgProps?.style,
                    ...edgeStyle,
                    color: edgeStyle.color || edgeStyle.stroke,
                }}
            >
                {highlightColor && (
                    <path
                        d={edgePath}
                        className={edgeDefaultUtils.createEdgeDefaultClassName(
                            { highlightColor },
                            "react-flow__edge-path-highlight"
                        )}
                        strokeWidth={pathGlowWidth}
                        style={{
                            ...highlightCustomPropertySettings,
                        }}
                    />
                )}

                <BaseEdge id={id} path={edgePath} markerStart={markerStart} markerEnd={markerEnd} />
                {renderedLabel}
            </g>
        );
    }
);
