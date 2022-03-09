import { EdgeStep } from "./../../../extensions/react-flow/edges/EdgeStep";
import { NodeDefault } from "./../../../extensions/react-flow/nodes/NodeDefault";

export const edgeTypes = {
    default: EdgeStep,
    success: EdgeStep,
    warning: EdgeStep,
    danger: EdgeStep,
};

export const nodeTypes = {
    default: NodeDefault,
    dataset: NodeDefault,
    linking: NodeDefault,
    transform: NodeDefault,
    task: NodeDefault,
    workflow: NodeDefault,
};
