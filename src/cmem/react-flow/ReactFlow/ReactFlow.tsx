import React from "react";
import {default as ReactFlowOriginal, ReactFlowProps as ReactFlowOriginalProps} from "react-flow-renderer";
import { ReactFlowMarkers } from "../../../extensions/react-flow/markers/ReactFlowMarkers";
import * as unspecifiedConfig from "./../configuration/unspecified";
import * as graphConfig from "./../configuration/graph";
import * as workflowConfig from "./../configuration/workflow";
import * as linkingConfig from "./../configuration/linking";
import * as inverseEdgeConfig from "./../configuration/inverseEdge";
import * as customLabelConfig from "./../configuration/customLabel";

export interface ReactFlowProps extends ReactFlowOriginalProps {
    /**
     * Load `ReactFlow` component with pre-configured values for `nodeTypes` and `edgeTypes`
     */
    configuration?: "unspecified" | "graph" | "workflow" | "linking" | "inverseEdge" | "customLabel";
}

/**
 * `ReactFlow` container extension that includes pre-configured nodes and edges for
 * Corporate Memory tools.
 */
export const ReactFlow = React.forwardRef<HTMLDivElement, ReactFlowProps>((
    {
        configuration = "unspecified",
        ...originalProps
    },
    ref) => {
    const configReactFlow = {
        unspecified: unspecifiedConfig,
        graph: graphConfig,
        workflow: workflowConfig,
        linking: linkingConfig,
        inverseEdge: inverseEdgeConfig,
        customLabel: customLabelConfig,
    }

    return (
        <ReactFlowOriginal
            ref={ref}
            nodeTypes={ configReactFlow[configuration].nodeTypes }
            edgeTypes={ configReactFlow[configuration].edgeTypes }
            {...originalProps}
        >
            <ReactFlowMarkers />
        </ReactFlowOriginal>
    );
})
