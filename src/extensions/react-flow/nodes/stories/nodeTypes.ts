import { nodeTypes as nodeTypesGraph } from "./../../../../cmem/react-flow/configuration/graph";
import { nodeTypes as nodeTypesLinking } from "./../../../../cmem/react-flow/configuration/linking";
import { nodeTypes as nodeTypesUnspecified } from "./../../../../cmem/react-flow/configuration/unspecified";
import { nodeTypes as nodeTypesWorkflow } from "./../../../../cmem/react-flow/configuration/workflow";

export const nodeTypes = {
    ...nodeTypesUnspecified,
    ...nodeTypesWorkflow,
    ...nodeTypesLinking,
    ...nodeTypesGraph,
};
