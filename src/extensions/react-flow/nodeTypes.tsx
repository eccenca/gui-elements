import React, { memo } from "react";
import { CLASSPREFIX as eccgui } from "@gui-elements/src/configuration/constants";
import { NodeSinkRectangular } from "./NodeRectangular";

export const nodeTypes = {
    classNode: NodeSinkRectangular,
    instanceNode: NodeSinkRectangular,
    propertyNode: NodeSinkRectangular,
    datasourceNode: NodeSinkRectangular,
    datasinkNode: NodeSinkRectangular,
    transformNode: NodeSinkRectangular,
    taskNode: NodeSinkRectangular,
    workflowNode: NodeSinkRectangular,
};

export const minimapNodeClassName = (node) => {
    return `${eccgui}-graphviz__minimap__node--` + node.type;
};
