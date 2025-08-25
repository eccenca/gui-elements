import { EdgeDefault } from "./../../../extensions/react-flow/edges/EdgeDefault";
import { EdgeStep } from "./../../../extensions/react-flow/edges/EdgeStep";
import { EdgeStraight } from "./../../../extensions/react-flow/edges/EdgeStraight";
import { NodeDefault } from "./../../../extensions/react-flow/nodes/NodeDefault";

export const edgeTypes = {
    default: EdgeDefault,
    straight: EdgeStraight,
    step: EdgeStep,
};

export const nodeTypes = {
    default: NodeDefault,
};
