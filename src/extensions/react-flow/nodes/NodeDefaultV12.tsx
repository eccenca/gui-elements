import React, { memo } from "react";
import { NodeProps as ReactFlowNodeProps, Position } from "react-flow-renderer";

import { Tooltip } from "../../../index";

import { NodeContent, NodeContentProps } from "./NodeContent";

export interface NodeDefaultProps<NODE_DATA, NODE_CONTENT_PROPS = any> extends ReactFlowNodeProps {
    /**
     * Contains all properties for our implementation of the React-Flow node.
     * For details pls see the `NodeContent` element documentation.
     */
    data: NodeContentProps<NODE_DATA, NODE_CONTENT_PROPS>;
}

/**
 * This element cannot be used directly, it must be connected via a `nodeTypes` definition.
 * @see https://reactflow.dev/docs/api/nodes/
 * @deprecated (v26) will be removed when `NodeDefault` supports v12 directly
 */
export const NodeDefaultV12 = memo((node: NodeDefaultProps<any>) => {
    const {
        data,
        targetPosition = Position.Left,
        sourcePosition = Position.Right,
        isConnectable = true,
        selected,
    } = node;

    const nodeEl = (
        <NodeContent {...{ flowVersion: "v12", ...data, targetPosition, sourcePosition, isConnectable, selected }} />
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
