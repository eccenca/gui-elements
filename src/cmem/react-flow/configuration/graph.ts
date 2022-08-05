import { EdgeDefault } from "./../../../extensions/react-flow/edges/EdgeDefault";
import { NodeDefault } from "./../../../extensions/react-flow/nodes/NodeDefault";
import { GRAPH_NODE_TYPES } from "./typing";

const edgeTypes = {
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

const nodeTypes: Record<GRAPH_NODE_TYPES, React.ReactNode> = {
    default: NodeDefault,
    graph: NodeDefault,
    class: NodeDefault,
    instance: NodeDefault,
    property: NodeDefault,
};

export { edgeTypes, nodeTypes };
