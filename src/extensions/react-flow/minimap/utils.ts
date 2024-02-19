import { intentClassName } from "../../../common/Intent";

import { CLASSPREFIX as eccgui } from "./../../../configuration/constants";
import { nodeContentUtils } from "./../nodes/NodeContent";

const nodeClassName = (node: any) => {
    const typeClass = `${eccgui}-graphviz__minimap__node--` + node.type;
    const stateClass = node.data?.highlightedState
        ? nodeContentUtils.gethighlightedStateClasses(node.data.highlightedState, `${eccgui}-graphviz__minimap__node`)
        : "";
    const intentClass = node.data?.intent ? intentClassName(node.data.intent) : "";
    return `${typeClass} ${intentClass} ${stateClass}`;
};

const nodeColor = (node: any) => {
    const fillColor = node.data?.style?.backgroundColor || node.data?.style?.borderColor;
    return fillColor ?? "";
};

const borderColor = (node: any) => {
    const strokeColor = node.data?.style?.borderColor || node.data?.style?.backgroundColor;
    return strokeColor ?? "";
};

export const miniMapUtils = {
    nodeClassName,
    nodeColor,
    borderColor,
};
