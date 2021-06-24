import { CLASSPREFIX as eccgui } from "./../../../configuration/constants";
import { gethighlightedStateClasses } from "./../nodes/NodeDefault";

export const minimapNodeClassName = (node) => {
    const typeClass = `${eccgui}-graphviz__minimap__node--` + node.type;
    const stateClass = node.data?.highlightedState ? gethighlightedStateClasses(node.data.highlightedState, `${eccgui}-graphviz__minimap__node`) : "";
    return typeClass + (stateClass ? " " + stateClass : "");
};
