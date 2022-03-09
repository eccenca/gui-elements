import { EdgeDefault } from "./../../../extensions/react-flow/edges/EdgeDefault";
import { NodeDefault } from "./../../../extensions/react-flow/nodes/NodeDefault";

export const edgeTypes = {
    default: EdgeDefault,
    implicit: EdgeDefault,
    import: EdgeDefault,
    subclass: EdgeDefault,
    subproperty: EdgeDefault,
    rdftype: EdgeDefault,
    success: EdgeDefault,
    warning: EdgeDefault,
    danger: EdgeDefault,
};

export const nodeTypes = {
    default: NodeDefault,
    graph: NodeDefault,
    class: NodeDefault,
    instance: NodeDefault,
    property: NodeDefault,
};
