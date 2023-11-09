import React from "react";
import {default as ReactFlowOriginal, ReactFlowProps as ReactFlowOriginalProps} from "react-flow-renderer";
import {ReactFlowMarkers} from "../../../extensions/react-flow/markers/ReactFlowMarkers";
import * as unspecifiedConfig from "./../configuration/unspecified";
import * as graphConfig from "./../configuration/graph";
import * as workflowConfig from "./../configuration/workflow";
import * as linkingConfig from "./../configuration/linking";
import {useReactFlowScrollOnDrag} from "../extensions/scrollOnDragHook";
import {ReactFlowHotkeyContext} from "../extensions/ReactFlowHotkeyContext";

export interface ReactFlowProps extends ReactFlowOriginalProps {
    /**
     * Load `ReactFlow` component with pre-configured values for `nodeTypes` and `edgeTypes`
     */
    configuration?: "unspecified" | "graph" | "workflow" | "linking";

    /** If defined the canvas scrolls on all drag operations (node, selection, edge connect)
     * when the mouse pointer comes near the canvas borders or goes beyond them.
     * The `id` property of the ReactFlow component must be set in order for this to work.
     *
     * NOTE: If scrollOnDrag is defined, a ReactFlowProvider must be wrapped around this component (or a parent). */
    scrollOnDrag?: {
        /** Time in milliseconds to wait before the canvas scrolls the next step. */
        scrollInterval: number
        /**
         * The size of each scroll step.
         * This should be a number between 0.0 - 1.0.
         * E.g. a value of 0.25 will lead to a scroll step size of a quarter of the visible canvas. */
        scrollStepSize: number
    }
}

/**
 * `ReactFlow` container extension that includes pre-configured nodes and edges for
 * Corporate Memory tools.
 */
export const ReactFlow = React.forwardRef<HTMLDivElement, ReactFlowProps>((
    {
        configuration = "unspecified",
        scrollOnDrag,
        children,
        ...originalProps
    },
    ref) => {

    /** If the hot keys should be disabled. By default, they are always disabled. */
    const {hotKeysDisabled} = React.useContext(ReactFlowHotkeyContext)

    const scrollOnDragFunctions = useReactFlowScrollOnDrag({
        reactFlowProps: originalProps,
        scrollOnDrag
    })

    const {selectionKeyCode, multiSelectionKeyCode, deleteKeyCode, zoomActivationKeyCode} = originalProps

    const configReactFlow = {
        unspecified: unspecifiedConfig,
        graph: graphConfig,
        workflow: workflowConfig,
        linking: linkingConfig,
    }

    return (
        <ReactFlowOriginal
            ref={ref}
            nodeTypes={ configReactFlow[configuration].nodeTypes }
            edgeTypes={ configReactFlow[configuration].edgeTypes }
            {...originalProps}
            {...scrollOnDragFunctions}
            selectionKeyCode={hotKeysDisabled ? null : selectionKeyCode as any}
            deleteKeyCode={hotKeysDisabled ? null : deleteKeyCode as any}
            multiSelectionKeyCode={hotKeysDisabled ? null : multiSelectionKeyCode as any}
            zoomActivationKeyCode={hotKeysDisabled ? null : zoomActivationKeyCode as any}
        >
            { children }
            <ReactFlowMarkers />
        </ReactFlowOriginal>
    );
})
