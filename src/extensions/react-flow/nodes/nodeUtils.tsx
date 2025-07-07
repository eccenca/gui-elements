import { CSSProperties } from "react";
import {Node as NodeV9, XYPosition as XYPositionV9} from "react-flow-renderer";
import {Node as NodeV10, XYPosition as XYPositionV10} from "react-flow-renderer-lts";
import {Node as NodeV12, XYPosition as XYPositionV12} from "@xyflow/react";
import Color from "color";
import {NodeDimensions} from "./NodeContent";

interface StickyNoteBase {
    id: string;
    content: string;
    color: string;
}
interface StickyNotePositionV9 {
    position: XYPositionV9 & NodeDimensions;
}
interface StickyNotePositionV10 {
    position: XYPositionV10 & NodeDimensions;
}
interface StickyNotePositionV12 {
    position: XYPositionV12 & NodeDimensions;
}

/** A sticky note for display in the UI as returned from the backend. */
export type StickyNote = (StickyNoteBase & StickyNotePositionV9) | (StickyNoteBase & StickyNotePositionV10) | (StickyNoteBase & StickyNotePositionV12);

/**
 * converts a react-flow node with
 * type = "stickynote" to StickyNote type compatible with the backend
 * @param node
 * @returns {StickyNote}
 */
const transformNodeToStickyNode = (node: NodeV9<any> | NodeV10<any> | NodeV12<any>): StickyNote => {
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
    } catch {
        // eslint-disable-next-line no-console
        console.warn("Received invalid color for sticky note: " + color);
    }
    return style;
};

export const nodeDefaultUtils = {
    generateStyleWithColor,
    transformNodeToStickyNode,
};

export default nodeDefaultUtils;
