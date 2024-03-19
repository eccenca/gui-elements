import React, { memo } from "react";

import { NodeDefault, NodeProps } from "./../../../extensions/react-flow/nodes/NodeDefault";

export const StickyNoteNode = memo((node: NodeProps<any>) => {
    const { data, ...otherNodeProps } = node;

    data.minimalShape = data.minimalShape ?? "none";

    return <NodeDefault data={data} {...otherNodeProps} />;
});
