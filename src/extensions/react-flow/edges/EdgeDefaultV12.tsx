import React, { memo } from "react";
import { BaseEdge, Edge, EdgeProps, EdgeText, getBezierPath } from "@xyflow/react";

import { nodeContentUtils } from "../nodes/NodeContent";
import { ReactFlowVersions } from "../versionsupport";

import { EdgeDefaultDataProps, edgeDefaultUtils } from "./EdgeDefault";

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
export type EdgeDefaultV12Props = EdgeProps<Edge<EdgeDefaultV12DataProps>>;

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
        ...edgeOriginalProperties
    }: EdgeDefaultV12Props) => {
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
                      markerStart: inversePath
                          ? `url(#react-flow__marker--${appearance}${intent ? `-${intent}` : "-none"}-reverse)`
                          : undefined,
                      markerEnd: !inversePath
                          ? `url(#react-flow__marker--${appearance}${intent ? `-${intent}` : "-none"}`
                          : undefined,
                  }
                : {};

        return (
            <g
                className={
                    "react-flow__edge " +
                    edgeDefaultUtils.createEdgeDefaultClassName(
                        { intent },
                        `${edgeOriginalProperties.selected ? "selected" : ""}`,
                        ReactFlowVersions.V12
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
                        {...marker}
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
