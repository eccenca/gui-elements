import React from "react";
import {
    default as ReactFlowOriginal,
    ReactFlowProps as ReactFlowOriginalProps
} from "react-flow-renderer";
import * as unspecifiedConfig from "./../configuration/unspecified";
import * as graphConfig from "./../configuration/graph";
import * as workflowConfig from "./../configuration/workflow";
import * as linkingConfig from "./../configuration/linking";

interface ReactFlowProps extends ReactFlowOriginalProps {
    /**
     * Load `ReactFlow` component with pre-configured values for `nodeTypes` and `edgeTypes`
     */
    configuration?: "unspecified" | "graph" | "workflow" | "linking";
}

export const ReactFlow = ({
    configuration = "unspecified",
    ...originalProps
}: ReactFlowProps) => {
    const configReactFlow = {
        unspecified: unspecifiedConfig,
        graph: graphConfig,
        workflow: workflowConfig,
        linking: linkingConfig,
    }

    return <ReactFlowOriginal { ...configReactFlow[configuration] } {...originalProps} />;
}
