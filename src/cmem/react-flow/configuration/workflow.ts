import { EdgeStep } from "./../../../extensions/react-flow/edges/EdgeStep";
import { NodeDefault } from "./../../../extensions/react-flow/nodes/NodeDefault";

export const edgeTypes = {
    default: EdgeStep,
    successStep: EdgeStep,
    warningStep: EdgeStep,
    dangerStep: EdgeStep,
};

export const nodeTypes = {
    default: NodeDefault,
    datasetNode: NodeDefault,
    linkingNode: NodeDefault,
    transformNode: NodeDefault,
    taskNode: NodeDefault,
    workflowNode: NodeDefault,
};
