import { EdgeBezier } from "./../../../extensions/react-flow/edges/EdgeBezier";
import { NodeDefault } from "./../../../extensions/react-flow/nodes/NodeDefault";
import { StickyNoteNode } from "./../nodes/StickyNoteNode";
import { WORKFLOW_NODE_TYPES } from "./typing";

const edgeTypes = {
    default: EdgeBezier,
    success: EdgeBezier,
    warning: EdgeBezier,
    danger: EdgeBezier,
};

const nodeTypes: Record<WORKFLOW_NODE_TYPES, React.ReactNode> = {
    default: NodeDefault,
    dataset: NodeDefault,
    linking: NodeDefault,
    transform: NodeDefault,
    task: NodeDefault,
    workflow: NodeDefault,
    stickynote: StickyNoteNode,
};

export { edgeTypes, nodeTypes };
