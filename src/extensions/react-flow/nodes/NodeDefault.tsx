import React, { memo } from "react";
import { NodeProps as ReactFlowNodeProps, Position } from "react-flow-renderer";

import { Tooltip } from "../../../index";
import { ReacFlowVersionSupportProps, useReactFlowVersion } from "../versionsupport";

import { NodeContent, NodeContentProps } from "./NodeContent";

export interface NodeDefaultProps<NODE_DATA, NODE_CONTENT_PROPS = any>
    extends ReacFlowVersionSupportProps,
        ReactFlowNodeProps {
    /**
     * Contains all properties for our implementation of the React-Flow node.
     * For details pls see the `NodeContent` element documentation.
     */
    data: NodeContentProps<NODE_DATA, NODE_CONTENT_PROPS>;
}

// @deprecated use NodeDefaultProps
export type NodeProps<NODE_DATA, NODE_CONTENT_PROPS = any> = NodeDefaultProps<NODE_DATA, NODE_CONTENT_PROPS>;

/**
 * The `NodeDefault` element manages the display of React-Flow nodes.
 * This element cannot be used directly, it must be connected via a `nodeTypes` definition and all properties need to be routed through the `elements` property items inside the `ReactFlow` container.
 * @see https://reactflow.dev/docs/api/nodes/
 */
export const NodeDefault = memo((node: NodeDefaultProps<any>) => {
    const {
        flowVersion,
        data,
        targetPosition = Position.Left,
        sourcePosition = Position.Right,
        isConnectable = true,
        selected,
    } = node;

    const evaluateFlowVersion = useReactFlowVersion();
    const flowVersionCheck = flowVersion || evaluateFlowVersion;

    const nodeEl = (
        <NodeContent
            {...{ flowVersion: flowVersionCheck, ...data, targetPosition, sourcePosition, isConnectable, selected }}
        />
    );

    if (!selected && data?.minimalShape !== "none" && !!data?.getMinimalTooltipData) {
        const tooltipData = data?.getMinimalTooltipData(node);
        if (!!tooltipData.label || !!tooltipData.content) {
            return (
                <Tooltip
                    content={
                        <>
                            {tooltipData.label && <div>{tooltipData.label}</div>}
                            {tooltipData.content && <div>{tooltipData.content}</div>}
                        </>
                    }
                >
                    {nodeEl}
                </Tooltip>
            );
        }
    }

    return nodeEl;
});

export default NodeDefault;
