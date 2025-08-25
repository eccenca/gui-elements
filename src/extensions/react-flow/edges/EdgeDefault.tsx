import React, { memo } from "react";
import { EdgeText, getEdgeCenter, getMarkerEnd } from "react-flow-renderer";
import { EdgeProps as ReactFlowEdgeProps } from "react-flow-renderer/dist/types";

import { intentClassName, IntentTypes } from "../../../common/Intent";
import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import { ReactFlowVersions, useReactFlowVersion } from "../versionsupport";

import { nodeContentUtils } from "./../nodes/NodeContent";
import { NodeHighlightColor } from "./../nodes/sharedTypes";
import { EdgeDefaultV12, EdgeDefaultV12Props } from "./EdgeDefaultV12";
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
    inversePath?: boolean; // FIXME: diection of animation is not inverted
    /**
     * Callback handler that returns a React element used as edge title.
     */
    renderLabel?: (edgeCenter: [number, number, number, number]) => React.ReactNode;
    /**
     * Properties are forwarded to the internally used SVG `g` element.
     * Data attributes for test ids coud be included here.
     */
    edgeSvgProps?: React.SVGProps<SVGGElement>;
}

/**
 * @deprecated (v26) v9 support is removed after v25
 */
export interface EdgeDefaultV9DataProps extends EdgeDefaultDataProps {
    /**
     * Reference link to the SVG marker used for the start of the edge
     * @deprecated (v26) only necessary for react flow v9
     */
    markerStart?: string;
}

/**
 * @deprecated (v26) v9 support is removed after v25
 */
export interface EdgeDefaultV9Props extends ReactFlowEdgeProps {
    /**
     * Defining content and markers for the edge.
     */
    data?: EdgeDefaultV9DataProps;
    /**
     * Callback handler that returns a SVG path as string to define how the edge is rendered.
     */
    drawSvgPath?: (edge: ReactFlowEdgeProps) => string;
}

export type EdgeDefaultProps = EdgeDefaultV9Props | EdgeDefaultV12Props;

const EdgeDefaultV9 = memo(
    ({ data = {}, drawSvgPath = drawEdgeStraight, ...edgeOriginalProperties }: EdgeDefaultV9Props) => {
        const { pathGlowWidth = 10, markerStart, strokeType, intent, highlightColor, edgeSvgProps } = data;

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
                {...edgeSvgProps}
                className={createEdgeDefaultClassName(
                    { intent },
                    `${edgeSvgProps?.className ?? ""}`,
                    ReactFlowVersions.V9
                )}
                style={{
                    ...edgeSvgProps?.style,
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
    }
);

/**
 * This element cannot be used directly, it must be connected via a `edgeTypes` definition.
 * @see https://reactflow.dev/docs/api/nodes/
 */
export const EdgeDefault = memo((props: EdgeDefaultProps) => {
    const flowVersionCheck = useReactFlowVersion();
    switch (flowVersionCheck) {
        case ReactFlowVersions.V9:
            return <EdgeDefaultV9 {...(props as EdgeDefaultV9Props)} />;
        case ReactFlowVersions.V12:
            return <EdgeDefaultV12 {...(props as EdgeDefaultV12Props)} />;
        default:
            return <></>;
    }
});

const createEdgeDefaultClassName = (
    { strokeType, intent, highlightColor }: EdgeDefaultDataProps,
    baseClass = "react-flow__edge-path",
    flowVersion?: ReactFlowVersions
) => {
    const { highlightClassNameSuffix } = nodeContentUtils.evaluateHighlightColors("--edge-highlight", highlightColor);
    return (
        baseClass +
        (flowVersion ? ` react-flow__edge--${flowVersion}` : "") +
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
