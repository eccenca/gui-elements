import React, { memo } from "react";
import { CLASSPREFIX as eccgui } from "@gui-elements/src/configuration/constants";
import { NodeRectangular, gethighlightedStateClasses } from "./NodeRectangular";

export const nodeTypes = {
    default: NodeRectangular,
    graphNode: NodeRectangular,
    classNode: NodeRectangular,
    instanceNode: NodeRectangular,
    propertyNode: NodeRectangular,
    datasourceNode: NodeRectangular,
    datasinkNode: NodeRectangular,
    transformNode: NodeRectangular,
    taskNode: NodeRectangular,
    workflowNode: NodeRectangular,
};

export const minimapNodeClassName = (node) => {
    const typeClass = `${eccgui}-graphviz__minimap__node--` + node.type;
    const stateClass = node.data?.highlightedState ? gethighlightedStateClasses(node.data.highlightedState, `${eccgui}-graphviz__minimap__node`) : "";
    return typeClass + (stateClass ? " " + stateClass : "");
};
