import { EdgeBezier } from "./../../../extensions/react-flow/edges/EdgeBezier";
import { NodeDefault } from "./../../../extensions/react-flow/nodes/NodeDefault";
import { GRAPH_NODE_TYPES } from "./typing";
//import {ComponentType} from "react";
//import {NodeProps} from "react-flow-renderer-lts";

const edgeTypes = {
    default: EdgeBezier,
    implicit: EdgeBezier,
    import: EdgeBezier,
    subclass: EdgeBezier,
    subproperty: EdgeBezier,
    rdftype: EdgeBezier,
    success: EdgeBezier,
    warning: EdgeBezier,
    danger: EdgeBezier,
};

const nodeTypes: Record<GRAPH_NODE_TYPES, React.ReactNode /*& ComponentType<NodeProps>*/> = {
    default: NodeDefault,
    graph: NodeDefault,
    class: NodeDefault,
    instance: NodeDefault,
    property: NodeDefault,
};

export { edgeTypes, nodeTypes };
