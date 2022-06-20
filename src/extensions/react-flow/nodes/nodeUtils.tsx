import { CSSProperties } from "react";
import { Node } from "react-flow-renderer";
import Color from "color";

const transformNodeToStickyNode = (node: Node<any>) => ({
    id: node.id,
    content: node.data.businessData.stickyNote!,
    position: [node.position.x, node.position.y],
    dimension: [node.data.nodeDimensions?.width!, node.data.nodeDimensions?.height!],
    color: node.data.style?.borderColor!,
});

const generateStyleWithColor = (color: string): CSSProperties => {
    let style: CSSProperties = {};
    try {
        const colorObj = Color("#fff").mix(Color(color), 0.24);
        style = {
            backgroundColor: colorObj.toString(),
            borderColor: color,
            color: colorObj.isLight() ? "#000" : "#fff",
        };
    } catch (ex) {
        console.warn("Received invalid color for sticky note: " + color);
    }
    return style;
};

const utils = {
    generateStyleWithColor,
    transformNodeToStickyNode,
};

export default utils;
