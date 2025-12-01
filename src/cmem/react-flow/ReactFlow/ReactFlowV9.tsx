import React from "react";
import {
    default as ReactFlowV9,
    ReactFlowProps as ReactFlowV9Props
} from "react-flow-renderer";

import { CLASSPREFIX as eccgui } from "../../../configuration/constants";

export type ReactFlowV9ContainerProps = ReactFlowV9Props;

/**
 * Our own `ReactFlow` v9 container.
 */
export const ReactFlowV9Container = React.forwardRef<HTMLDivElement, ReactFlowV9ContainerProps>(
    ({ children, className, ...originalProps }, outerRef) => {
        const innerRef = React.useRef<HTMLDivElement>(null);
        React.useImperativeHandle(outerRef, () => innerRef.current!, []);

        return (
            <ReactFlowV9
                ref={innerRef}
                className={`${eccgui}-graphviz__canvas--reactflow9` + (className ? ` ${className}` : "")}
                {...originalProps}
            >
                {children}
            </ReactFlowV9>
        );
    }
);
