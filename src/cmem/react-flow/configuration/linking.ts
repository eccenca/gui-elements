
import { EdgeStep } from "./../../../extensions/react-flow/edges/EdgeStep";
import { NodeDefault } from "./../../../extensions/react-flow/nodes/NodeDefault";
import colors from "./_colors-linking.module.scss";

const edgeTypes = {
    default: EdgeStep,
    value: EdgeStep,
    score: EdgeStep,
    success: EdgeStep,
    warning: EdgeStep,
    danger: EdgeStep,
};

const nodeTypes = {
    default: NodeDefault,
    sourcepath: NodeDefault,
    targetpath: NodeDefault,
    transformation: NodeDefault,
    comparator: NodeDefault,
    aggregator: NodeDefault,
};

 export {
     edgeTypes,
     nodeTypes,
     colors,
 }
