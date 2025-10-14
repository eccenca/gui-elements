import React, { memo } from "react";
import { BaseEdge, Edge, EdgeProps, EdgeText, GetBezierPathParams } from "@xyflow/react";

import { nodeContentUtils } from "../nodes/NodeContent";
import { ReactFlowVersions } from "../versionsupport";

import { EdgeDefaultDataProps, edgeDefaultUtils } from "./EdgeDefault";
import { getStraightPath } from "./utils";

/**
 * @deprecated (v26) use EdgeDefaultDataProps
 */
export interface EdgeDefaultV12DataProps extends Record<string, unknown>, EdgeDefaultDataProps {
    /**
     * Set the marker used on the start or end of the edge.
     */
    markerAppearance?: "arrow-closed" | "none";
}

/**
 * @deprecated (v26) use EdgeDefaultProps
 */
export type EdgeDefaultV12Props = EdgeProps<Edge<EdgeDefaultV12DataProps>> & {
    /**
     * Callback handler that returns SVG path and label position of the edge.
     */
    getPath?: (
        edgeParams: Omit<GetBezierPathParams, "curvature"> & Record<string, unknown>
    ) => [path: string, labelX: number, labelY: number, offsetX: number, offsetY: number];
};

/**
 * This element cannot be used directly, it must be connected via a `edgeTypes` definition.
 * @see https://reactflow.dev/docs/api/nodes/
 * @deprecated (v26) will be removed when `EdgeDefault` supports v12 directly
 */
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
        getPath = getStraightPath,
        ...edgeOriginalProperties
    }: EdgeDefaultV12Props) => {
        const {
            pathGlowWidth = 10,
            highlightColor,
            renderLabel,
            edgeSvgProps,
            intent,
            arrowDirection = "normal",
            strokeType,
        } = data;

        const [edgePath, labelX, labelY] = getPath({
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

        const renderedLabel =
            renderLabel?.([labelX, labelY, sourceX, targetX]) ??
            (label ? (
                <EdgeText
                    x={labelX}
                    y={labelY}
                    label={label}
                    labelStyle={labelStyle}
                    labelShowBg={labelShowBg}
                    labelBgStyle={labelBgStyle}
                    labelBgPadding={labelBgPadding || [5, 5]}
                    labelBgBorderRadius={labelBgBorderRadius || 3}
                />
            ) : null);

        const appearance = data.markerAppearance ?? "arrow-closed";

        const marker =
            appearance !== "none"
                ? {
                      markerStart:
                          arrowDirection === "inversed" || arrowDirection === "bidirectional"
                              ? `url(#react-flow__marker--${appearance}${intent ? `-${intent}` : "-none"}-reverse)`
                              : undefined,
                      markerEnd:
                          arrowDirection === "normal" || arrowDirection === "bidirectional"
                              ? `url(#react-flow__marker--${appearance}${intent ? `-${intent}` : "-none"}`
                              : undefined,
                  }
                : {};

        return (
            <g
                {...edgeSvgProps}
                className={edgeDefaultUtils.createEdgeDefaultClassName(
                    { intent },
                    `${edgeSvgProps?.className ?? ""}`,
                    ReactFlowVersions.V12
                )}
                tabIndex={0}
                role="button"
                data-id={id}
                aria-label={`Edge from ${edgeOriginalProperties.source} to ${edgeOriginalProperties.target}`}
                aria-describedby={`react-flow__edge-desc-${id}`}
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
                <BaseEdge
                    id={id}
                    path={edgePath}
                    {...marker}
                    className={edgeDefaultUtils.createEdgeDefaultClassName({ strokeType })}
                    interactionWidth={pathGlowWidth}
                    style={{
                        ...edgeSvgProps?.style,
                        ...edgeStyle,
                        color: edgeStyle.color || edgeStyle.stroke,
                    }}
                />
                {renderedLabel}
            </g>
        );
    }
);
