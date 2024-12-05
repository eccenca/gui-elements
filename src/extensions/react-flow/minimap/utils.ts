import { intentClassName } from "../../../common/Intent";

import { CLASSPREFIX as eccgui } from "./../../../configuration/constants";

const nodeClassName = (node: any) => {
    const typeClass = `${eccgui}-graphviz__minimap__node--` + node.type;
    // TODO: re-implement the evaluation of node.data.highlightColor so it is highlighted the same way in the minimap, too.
    const intentClass = node.data?.intent ? intentClassName(node.data.intent) : "";
    return `${typeClass} ${intentClass}`;
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
