import { EdgeStep } from "./../../../extensions/react-flow/edges/EdgeStep";
import { NodeDefault } from "./../../../extensions/react-flow/nodes/NodeDefault";
import { StickyNoteNode } from "./../nodes/StickyNoteNode";
import { LINKING_NODE_TYPES } from "./typing";
import {NodeProps} from "react-flow-renderer";

const edgeTypes = {
    default: EdgeStep,
    value: EdgeStep,
    score: EdgeStep,
    success: EdgeStep,
    warning: EdgeStep,
    danger: EdgeStep,
};

const nodeTypes: Record<LINKING_NODE_TYPES, React.ComponentType<NodeProps> /*& ComponentType<NodeProps>*/> = {
    default: NodeDefault,
    sourcepath: NodeDefault,
    targetpath: NodeDefault,
    transformation: NodeDefault,
    comparator: NodeDefault,
    aggregator: NodeDefault,
    stickynote: StickyNoteNode,
};

export { edgeTypes, nodeTypes };
