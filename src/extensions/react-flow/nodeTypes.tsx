import {CLASSPREFIX as eccgui} from "@gui-elements/src/configuration/constants";
import {gethighlightedStateClasses, NodeRectangular} from "./NodeRectangular";

export const nodeTypes = {
    default: NodeRectangular,
    /*
    // only for reference, they don't need to defined explicitely
    graphNode: NodeRectangular,
    classNode: NodeRectangular,
    instanceNode: NodeRectangular,
    propertyNode: NodeRectangular,
    datasetNode: NodeRectangular,
    linkingNode: NodeRectangular,
    transformNode: NodeRectangular,
    taskNode: NodeRectangular,
    workflowNode: NodeRectangular,
    */
};

export const minimapNodeClassName = (node) => {
    const typeClass = `${eccgui}-graphviz__minimap__node--` + node.type;
    const stateClass = node.data?.highlightedState ? gethighlightedStateClasses(node.data.highlightedState, `${eccgui}-graphviz__minimap__node`) : "";
    return typeClass + (stateClass ? " " + stateClass : "");
};
