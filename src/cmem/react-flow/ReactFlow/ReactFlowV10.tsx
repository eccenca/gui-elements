import React from "react";
import {
    default as ReactFlowV10,
    Edge,
    Node,
    ReactFlowProps as ReactFlowV10Props,
    useEdgesState,
    useNodesState,
} from "react-flow-renderer-lts";

import { CLASSPREFIX as eccgui } from "../../../configuration/constants";

export type ReactFlowV10ContainerProps = ReactFlowV10Props;

/**
 * Our own `ReactFlow` v10 container.
 */
export const ReactFlowV10Container = React.forwardRef<HTMLDivElement, ReactFlowV10ContainerProps>(
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
            <ReactFlowV10
                ref={innerRef}
                className={`${eccgui}-graphviz__canvas--reactflow10` + (className ? ` ${className}` : "")}
                {...originalProps}
                {...missingNodesChangeCallback}
                {...missingEdgesChangeCallback}
            >
                {children}
            </ReactFlowV10>
        );
    }
);
