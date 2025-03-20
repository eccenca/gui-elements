import { CSSProperties } from "react";
import {Node, XYPosition} from "react-flow-renderer";
import Color from "color";
import {NodeDimensions} from "./NodeContent";

/** A sticky note for display in the UI as returned from the backend. */
export interface StickyNote {
    id: string;
    content: string;
    color: string;
    position: XYPosition & NodeDimensions;
}

/**
 * converts a react-flow node with
 * type = "stickynote" to StickyNote type compatible with the backend
 * @param node
 * @returns {StickyNote}
 */
const transformNodeToStickyNode = (node: Node<any>): StickyNote => {
    return {
        id: node.id,
        content: node.data.businessData.stickyNote!,
        position: {x: node.position.x, y: node.position.y, width: node.data.nodeDimensions?.width, height: node.data.nodeDimensions?.height},
        color: node.data.style?.borderColor!,
    }
};

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
