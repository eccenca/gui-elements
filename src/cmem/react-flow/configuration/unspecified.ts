import { EdgeDefault } from "./../../../extensions/react-flow/edges/EdgeDefault";
import { EdgeStep } from "./../../../extensions/react-flow/edges/EdgeStep";
import { NodeDefault } from "./../../../extensions/react-flow/nodes/NodeDefault";

export const edgeTypes = {
    default: EdgeDefault,
    straight: EdgeDefault,
    step: EdgeStep,
};

export const nodeTypes = {
    default: NodeDefault,
};
