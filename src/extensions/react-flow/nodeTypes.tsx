import React, { memo } from "react";
import { CLASSPREFIX as eccgui } from "@gui-elements/src/configuration/constants";
import { NodeRectangular } from "./NodeRectangular";

export const nodeTypes = {
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
    return `${eccgui}-graphviz__minimap__node--` + node.type;
};
