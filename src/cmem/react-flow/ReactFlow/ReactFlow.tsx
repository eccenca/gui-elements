import React from "react";
import {default as ReactFlowOriginal, ReactFlowProps as ReactFlowOriginalProps} from "react-flow-renderer";
import { ReactFlowMarkers } from "../../../extensions/react-flow/markers/ReactFlowMarkers";
import * as unspecifiedConfig from "./../configuration/unspecified";
import * as graphConfig from "./../configuration/graph";
import * as workflowConfig from "./../configuration/workflow";
import * as linkingConfig from "./../configuration/linking";

export interface ReactFlowProps extends ReactFlowOriginalProps {
    /**
     * Load `ReactFlow` component with pre-configured values for `nodeTypes` and `edgeTypes`
     */
    configuration?: "unspecified" | "graph" | "workflow" | "linking";
}

/**
 * `ReactFlow` container extension that includes pre-configured nodes and edges for
 * Corporate Memory tools.
 */
export const ReactFlow = React.forwardRef<HTMLDivElement, ReactFlowProps>((
    {
        configuration = "unspecified",
        children,
        ...originalProps
    },
    ref) => {
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
        >
            { children }
            <ReactFlowMarkers />
        </ReactFlowOriginal>
    );
})
