
import { EdgeStep } from "./../../../extensions/react-flow/edges/EdgeStep";
import { NodeDefault } from "./../../../extensions/react-flow/nodes/NodeDefault";

export const edgeTypes = {
    default: EdgeStep,
    value: EdgeStep,
    score: EdgeStep,
    successStep: EdgeStep,
    warningStep: EdgeStep,
    dangerStep: EdgeStep,
};

export const nodeTypes = {
    default: NodeDefault,
    sourcepath: NodeDefault,
    targetpath: NodeDefault,
    transform: NodeDefault,
    comparator: NodeDefault,
    aggregator: NodeDefault,
};
