import { NodeProps } from "react-flow-renderer";

import { WORKFLOW_NODE_TYPES } from "@/cmem/react-flow/configuration/typing";
import { StickyNoteNode } from "@/cmem/react-flow/nodes/StickyNoteNode";
import { EdgeStep } from "@/extensions/react-flow/edges/EdgeStep";
import { NodeDefault } from "@/extensions/react-flow/nodes/NodeDefault";

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
