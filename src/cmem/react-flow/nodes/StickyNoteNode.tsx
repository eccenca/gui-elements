import React, { memo } from "react";

import { NodeDefault, NodeDefaultProps } from "./../../../extensions/react-flow/nodes/NodeDefault";

export const StickyNoteNode = memo((node: NodeDefaultProps<any>) => {
    const { data, ...otherNodeProps } = node;

    data.minimalShape = data.minimalShape ?? "none";

    return <NodeDefault data={data} {...otherNodeProps} />;
});
