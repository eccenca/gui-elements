import { CLASSPREFIX as eccgui } from "./../../../configuration/constants";
import { gethighlightedStateClasses } from "./../nodes/NodeDefault";

export const minimapNodeClassName = (node) => {
    const typeClass = `${eccgui}-graphviz__minimap__node--` + node.type;
    const stateClass = node.data?.highlightedState ? gethighlightedStateClasses(node.data.highlightedState, `${eccgui}-graphviz__minimap__node`) : "";
    const customColor = node.data?.style?.borderColor ? `${eccgui}-graphviz__minimap__node--customcolor` : "";
    return typeClass + (stateClass ? " " + stateClass : "") + (customColor ? " " + customColor : "");
};

export const minimapNodeColor = (node) => {
    return node.data?.style?.borderColor ?? "";
}
