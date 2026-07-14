import { NodeProps } from "react-flow-renderer";

import { LINKING_NODE_TYPES } from "@/cmem/react-flow/configuration/typing";
import { StickyNoteNode } from "@/cmem/react-flow/nodes/StickyNoteNode";
import { EdgeStep } from "@/extensions/react-flow/edges/EdgeStep";
import { NodeDefault } from "@/extensions/react-flow/nodes/NodeDefault";

const edgeTypes = {
    default: EdgeStep,
    value: EdgeStep,
    score: EdgeStep,
    success: EdgeStep,
    warning: EdgeStep,
    danger: EdgeStep,
};

const nodeTypes: Record<LINKING_NODE_TYPES, React.ComponentType<NodeProps>> = {
    default: NodeDefault,
    sourcepath: NodeDefault,
    targetpath: NodeDefault,
    transformation: NodeDefault,
    comparator: NodeDefault,
    aggregator: NodeDefault,
    stickynote: StickyNoteNode,
};

export { edgeTypes, nodeTypes };
