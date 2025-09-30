import { EdgeStep } from "./../../../extensions/react-flow/edges/EdgeStep";
import { NodeDefault } from "./../../../extensions/react-flow/nodes/NodeDefault";
import { StickyNoteNode } from "./../nodes/StickyNoteNode";
import { WORKFLOW_NODE_TYPES } from "./typing";
import {NodeProps} from "react-flow-renderer";

const edgeTypes = {
    default: EdgeStep,
    success: EdgeStep,
    warning: EdgeStep,
    danger: EdgeStep,
};

const nodeTypes: Record<WORKFLOW_NODE_TYPES, React.ComponentType<NodeProps>> = {
    default: NodeDefault,
    dataset: NodeDefault,
    linking: NodeDefault,
    transform: NodeDefault,
    task: NodeDefault,
    workflow: NodeDefault,
    stickynote: StickyNoteNode,
};

export { edgeTypes, nodeTypes };
