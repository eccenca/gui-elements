import React from "react";
import {
    default as ReactFlowOriginal,
    Edge,
    EdgeTypes,
    KeyCode,
    Node,
    NodeTypes,
    ReactFlowProps as ReactFlowOriginalProps,
    useEdgesState,
    useNodesState,
} from "react-flow-renderer-lts";

import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import { ReactFlowMarkers } from "../../../extensions/react-flow/markers/ReactFlowMarkers";
import { ReactFlowHotkeyContext } from "../extensions/ReactFlowHotkeyContext";
import { useReactFlowScrollOnDragV10 } from "../extensions/scrollOnDragHookV10";

import * as graphConfig from "./../configuration/graph";
import * as linkingConfig from "./../configuration/linking";
import * as unspecifiedConfig from "./../configuration/unspecified";
import * as workflowConfig from "./../configuration/workflow";

export interface ReactFlowPropsV10 extends ReactFlowOriginalProps {
    /**
     * Load `ReactFlow` component with pre-configured values for `nodeTypes` and `edgeTypes`
     */
    configuration?: "unspecified" | "graph" | "workflow" | "linking";

    /**
     * Types data transfers that can be dragged in and dropped on the canvas.
     */
    dropzoneFor?: string[];

    /** If defined the canvas scrolls on all drag operations (node, selection, edge connect)
     * when the mouse pointer comes near the canvas borders or goes beyond them.
     * The `id` property of the ReactFlow component must be set in order for this to work.
     *
     * NOTE: If scrollOnDrag is defined, a ReactFlowProvider must be wrapped around this component (or a parent). */
    scrollOnDrag?: {
        /** Time in milliseconds to wait before the canvas scrolls the next step. */
        scrollInterval: number;
        /**
         * The size of each scroll step.
         * This should be a number between 0.0 - 1.0.
         * E.g. a value of 0.25 will lead to a scroll step size of a quarter of the visible canvas. */
        scrollStepSize: number;
    };
}

const configReactFlow: Record<string, { nodeTypes: NodeTypes; edgeTypes: EdgeTypes }> = {
    unspecified: unspecifiedConfig,
    graph: graphConfig,
    workflow: workflowConfig,
    linking: linkingConfig,
};

/**
 * `ReactFlow` v10 container extension that includes pre-configured nodes and edges for
 * Corporate Memory tools.
 */
export const ReactFlowV10 = React.forwardRef<HTMLDivElement, ReactFlowPropsV10>(
    ({ configuration = "unspecified", scrollOnDrag, dropzoneFor, children, className, ...originalProps }, outerRef) => {
        const innerRef = React.useRef<HTMLDivElement>(null);
        React.useImperativeHandle(outerRef, () => innerRef.current!, []);

        const [nodesFallback, , onNodesChangeFallback] = useNodesState(originalProps.nodes || ([] as Node[]));
        const [edgesFallback, , onEdgesChangeFallback] = useEdgesState(originalProps.edges || ([] as Edge[]));

        React.useEffect(() => {
            const reactflowContainer = innerRef?.current;

            if (reactflowContainer && dropzoneFor) {
                const addDragover = (event: DragEvent) => {
                    reactflowContainer.classList.add(`${eccgui}-graphviz__canvas--draghover`);
                    event.preventDefault();
                };

                const removeDragover = (event: DragEvent) => {
                    if (reactflowContainer === event.target) {
                        reactflowContainer.classList.remove(`${eccgui}-graphviz__canvas--draghover`);
                    }
                };

                reactflowContainer.addEventListener("dragover", addDragover);
                reactflowContainer.addEventListener("dragleave", removeDragover);
                reactflowContainer.addEventListener("drop", removeDragover);
                return () => {
                    reactflowContainer.removeEventListener("dragover", addDragover);
                    reactflowContainer.removeEventListener("dragleave", removeDragover);
                    reactflowContainer.removeEventListener("drop", removeDragover);
                };
            }
            return;
        }, [innerRef, dropzoneFor]);

        /** If the hot keys should be disabled. By default, they are always disabled. */
        const { hotKeysDisabled } = React.useContext(ReactFlowHotkeyContext);

        const scrollOnDragFunctions = useReactFlowScrollOnDragV10({
            reactFlowProps: originalProps,
            scrollOnDrag,
        });

        const { selectionKeyCode, multiSelectionKeyCode, deleteKeyCode, zoomActivationKeyCode } = originalProps;

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
            <ReactFlowOriginal
                ref={innerRef}
                className={`${eccgui}-graphviz__canvas` + className ? ` ${className}` : ""}
                nodeTypes={configReactFlow[configuration].nodeTypes}
                edgeTypes={configReactFlow[configuration].edgeTypes}
                {...originalProps}
                {...scrollOnDragFunctions}
                {...missingNodesChangeCallback}
                {...missingEdgesChangeCallback}
                data-dropzone-for={dropzoneFor ? dropzoneFor.join(" ") : undefined}
                selectionKeyCode={hotKeysDisabled ? null : (selectionKeyCode as KeyCode)}
                deleteKeyCode={hotKeysDisabled ? null : (deleteKeyCode as KeyCode)}
                multiSelectionKeyCode={hotKeysDisabled ? null : (multiSelectionKeyCode as KeyCode)}
                zoomActivationKeyCode={hotKeysDisabled ? null : (zoomActivationKeyCode as KeyCode)}
            >
                {children}
                <ReactFlowMarkers />
            </ReactFlowOriginal>
        );
    }
);
