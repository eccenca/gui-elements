import React from "react";
import {default as ReactFlowOriginal, ReactFlowProps as ReactFlowOriginalProps} from "react-flow-renderer";
import {ReactFlowMarkers} from "../../../extensions/react-flow/markers/ReactFlowMarkers";
import * as unspecifiedConfig from "./../configuration/unspecified";
import * as graphConfig from "./../configuration/graph";
import * as workflowConfig from "./../configuration/workflow";
import * as linkingConfig from "./../configuration/linking";
import {useReactFlowScrollOnDrag} from "../extensions/scrollOnDragHook";

export interface ReactFlowProps extends ReactFlowOriginalProps {
    /**
     * Load `ReactFlow` component with pre-configured values for `nodeTypes` and `edgeTypes`
     */
    configuration?: "unspecified" | "graph" | "workflow" | "linking";

    /** If defined the canvas scrolls on all drag operations (node, selection, edge connect)
     * when the mouse pointer comes near the canvas borders or goes beyond them.
     * The `id` property of the ReactFlow component must be set in order for this to work. */
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

    const scrollOnDragFunctions = useReactFlowScrollOnDrag({
        reactFlowProps: originalProps,
        scrollOnDrag
    })

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
        >
            { children }
            <ReactFlowMarkers />
        </ReactFlowOriginal>
    );
})
