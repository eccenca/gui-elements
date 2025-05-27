import React from "react";
import {
    Edge,
    Node,
    ReactFlow as ReactFlowV12,
    ReactFlowProps as ReactFlowV12Props,
    useEdgesState,
    useNodesState,
} from "@xyflow/react";

import { CLASSPREFIX as eccgui } from "../../../configuration/constants";

export type ReactFlowV12ContainerProps = ReactFlowV12Props;

/**
 * Our own `ReactFlow` v12 container.
 */
export const ReactFlowV12Container = React.forwardRef<HTMLDivElement, ReactFlowV12ContainerProps>(
    ({ children, className, ...originalProps }, outerRef) => {
        const innerRef = React.useRef<HTMLDivElement>(null);
        React.useImperativeHandle(outerRef, () => innerRef.current!, []);

        const [nodesFallback, , onNodesChangeFallback] = useNodesState(originalProps.nodes || ([] as Node[]));
        const [edgesFallback, , onEdgesChangeFallback] = useEdgesState(originalProps.edges || ([] as Edge[]));

        const missingNodesChangeCallback =
            !!originalProps.nodes && !originalProps.onNodesChange
                ? {
                      nodes: nodesFallback,
                      onNodesChange: onNodesChangeFallback,
                  }
                : {};

        const missingEdgesChangeCallback =
            !!originalProps.edges && !originalProps.onEdgesChange
                ? {
                      edges: edgesFallback,
                      onEdgesChange: onEdgesChangeFallback,
                  }
                : {};

        return (
            <ReactFlowV12
                ref={innerRef}
                className={`${eccgui}-graphviz__canvas--reactflow12` + (className ? ` ${className}` : "")}
                {...originalProps}
                {...missingNodesChangeCallback}
                {...missingEdgesChangeCallback}
            >
                {children}
            </ReactFlowV12>
        );
    }
);
