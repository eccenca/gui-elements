import { memo } from "react";
import React from "react";
import { BaseEdge, Edge, EdgeProps, EdgeText, getBezierPath, getEdgeCenter } from "@xyflow/react";

import { IntentTypes } from "../../../common/Intent";
import { nodeContentUtils } from "../nodes/NodeContent";
import { NodeHighlightColor } from "../nodes/sharedTypes";

import { edgeDefaultUtils } from "./EdgeDefault";

export type EdgeDefaultV12DataProps = Record<string, unknown> & {
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
        sourcePosition,
        targetPosition,
        label,
        labelStyle,
        labelShowBg,
        labelBgStyle,
        labelBgPadding = [5, 5],
        labelBgBorderRadius = 3,
        data = {},
        ...edgeOriginalProperties
    }: EdgeProps<Edge<EdgeDefaultV12DataProps>>) => {
        const { pathGlowWidth = 10, highlightColor, renderLabel, edgeSvgProps, intent, inversePath, strokeType } = data;

        const [edgePath, labelX, labelY] = getBezierPath({
            sourceX,
            sourceY,
            sourcePosition,
            targetX,
            targetY,
            targetPosition,
        });

        const edgeStyle = edgeOriginalProperties.style ?? {};
        const { highlightCustomPropertySettings } = nodeContentUtils.evaluateHighlightColors(
            "--edge-highlight",
            highlightColor
        );

        const edgeCenter = getEdgeCenter({
            sourceX,
            sourceY,
            targetX,
            targetY,
        });

        const renderedLabel =
            renderLabel?.([labelX, labelY, sourceX, targetX]) ??
            (label ? (
                <EdgeText
                    x={edgeCenter[0]}
                    y={edgeCenter[1]}
                    label={label}
                    labelStyle={labelStyle}
                    labelShowBg={labelShowBg}
                    labelBgStyle={labelBgStyle}
                    labelBgPadding={labelBgPadding || [5, 5]}
                    labelBgBorderRadius={labelBgBorderRadius || 3}
                />
            ) : null);

        return (
            <g
                className={
                    "react-flow__edge " +
                    edgeDefaultUtils.createEdgeDefaultClassName(
                        { intent },
                        `${edgeOriginalProperties.selected ? "selected" : ""}`
                    )
                }
                tabIndex={0}
                role="button"
                data-id={id}
                aria-label={`Edge from ${edgeOriginalProperties.source} to ${edgeOriginalProperties.target}`}
                aria-describedby={`react-flow__edge-desc-${id}`}
            >
                <g className={edgeSvgProps?.className ?? ""}>
                    {highlightColor && (
                        <path
                            d={edgePath}
                            className={edgeDefaultUtils.createEdgeDefaultClassName(
                                { highlightColor },
                                "react-flow__edge-path-highlight"
                            )}
                            strokeWidth={10}
                            style={{
                                ...highlightCustomPropertySettings,
                            }}
                        />
                    )}

                    <BaseEdge
                        id={id}
                        path={edgePath}
                        markerStart={inversePath ? "url(#arrow-closed-reverse)" : undefined}
                        markerEnd={!inversePath ? "url(#arrow-closed)" : undefined}
                        className={edgeDefaultUtils.createEdgeDefaultClassName({ strokeType })}
                        interactionWidth={pathGlowWidth}
                        style={{
                            ...edgeSvgProps?.style,
                            ...edgeStyle,
                            color: edgeStyle.color || edgeStyle.stroke,
                        }}
                    />
                </g>
                {renderedLabel}
            </g>
        );
    }
);
