import { CSSProperties } from "react";
import { Node } from "react-flow-renderer";
import Color from "color";

interface IStickyNote {
    id: string;
    content: string;
    color: string;
    position: number[];
    dimension: number[];
}

/**
 * converts a react-flow node with
 * type = "stickynote" to IStickyNote type compatible with the backend
 * @param node
 * @returns {IStickyNote}
 */
const transformNodeToStickyNode = (node: Node<any>): IStickyNote => ({
    id: node.id,
    content: node.data.businessData.stickyNote!,
    position: [node.position.x, node.position.y],
    dimension: [node.data.nodeDimensions?.width!, node.data.nodeDimensions?.height!],
    color: node.data.style?.borderColor!,
});

/**
 * takes in a hex color string and returns
 * a style object with style rules for borderColor, backgroundColor and color
 * @param {string} color
 * @returns {CSSProperties}
 */
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

export const nodeDefaultUtils = {
    generateStyleWithColor,
    transformNodeToStickyNode,
};

export default nodeDefaultUtils;
