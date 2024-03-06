/**
 * Copied from `react-flow` because we need to change there routing.
 * We use the 10.2.0cversion minus commit 87d518f8b5540a91a3f9c163a2315c2de47abc31
 * @see https://github.com/wbkd/react-flow/commit/87d518f8b5540a91a3f9c163a2315c2de47abc31
 */

import { getEdgeCenter as getCenter, Position } from "react-flow-renderer";

// These are some helper methods for drawing the round corners
// The name indicates the direction of the path. "bottomLeftCorner" goes
// from bottom to the left and "leftBottomCorner" goes from left to the bottom.
// We have to consider the direction of the paths because of the animated lines.
const bottomLeftCorner = (x: number, y: number, size: number): string =>
    `L ${x},${y - size}Q ${x},${y} ${x + size},${y}`;
const leftBottomCorner = (x: number, y: number, size: number): string =>
    `L ${x + size},${y}Q ${x},${y} ${x},${y - size}`;
const bottomRightCorner = (x: number, y: number, size: number): string =>
    `L ${x},${y - size}Q ${x},${y} ${x - size},${y}`;
const rightBottomCorner = (x: number, y: number, size: number): string =>
    `L ${x - size},${y}Q ${x},${y} ${x},${y - size}`;
const leftTopCorner = (x: number, y: number, size: number): string => `L ${x + size},${y}Q ${x},${y} ${x},${y + size}`;
const topLeftCorner = (x: number, y: number, size: number): string => `L ${x},${y + size}Q ${x},${y} ${x + size},${y}`;
const topRightCorner = (x: number, y: number, size: number): string => `L ${x},${y + size}Q ${x},${y} ${x - size},${y}`;
const rightTopCorner = (x: number, y: number, size: number): string => `L ${x - size},${y}Q ${x},${y} ${x},${y + size}`;

export interface GetSmoothStepPathParams {
    sourceX: number;
    sourceY: number;
    sourcePosition?: Position;
    targetX: number;
    targetY: number;
    targetPosition?: Position;
    borderRadius?: number;
    centerX?: number;
    centerY?: number;
}

export function getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition = Position.Bottom,
    targetX,
    targetY,
    targetPosition = Position.Top,
    borderRadius = 5,
    centerX,
    centerY,
}: GetSmoothStepPathParams): string {
    const [_centerX, _centerY, offsetX, offsetY] = getCenter({ sourceX, sourceY, targetX, targetY });
    const cornerWidth = Math.min(borderRadius, Math.abs(targetX - sourceX));
    const cornerHeight = Math.min(borderRadius, Math.abs(targetY - sourceY));
    const cornerSize = Math.min(cornerWidth, cornerHeight, offsetX, offsetY);
    const cX = typeof centerX !== "undefined" ? centerX : _centerX;
    const cY = typeof centerY !== "undefined" ? centerY : _centerY;

    let firstCornerPath = "";
    let secondCornerPath = "";

    if (sourceX <= targetX) {
        if (sourceY <= targetY) {
            firstCornerPath = bottomLeftCorner(sourceX, cY, cornerSize);
            secondCornerPath = rightTopCorner(targetX, cY, cornerSize);
            if (sourcePosition === Position.Right) {
                if (targetPosition === Position.Left) {
                    firstCornerPath = rightTopCorner(cX, sourceY, cornerSize);
                    secondCornerPath = bottomLeftCorner(cX, targetY, cornerSize);
                }
            } else {
                if (targetPosition === Position.Left) {
                    // no change
                }
            }
        } else {
            firstCornerPath = topLeftCorner(sourceX, cY, cornerSize);
            secondCornerPath = rightBottomCorner(targetX, cY, cornerSize);
            if (sourcePosition === Position.Right) {
                if (targetPosition === Position.Left) {
                    firstCornerPath = rightBottomCorner(cX, sourceY, cornerSize);
                    secondCornerPath = topLeftCorner(cX, targetY, cornerSize);
                }
            } else {
                if (targetPosition === Position.Left) {
                    // no change
                }
            }
        }
    } else {
        if (sourceY <= targetY) {
            firstCornerPath = bottomRightCorner(sourceX, cY, cornerSize);
            secondCornerPath = leftTopCorner(targetX, cY, cornerSize);
            if (sourcePosition === Position.Left) {
                if (targetPosition === Position.Right) {
                    firstCornerPath = leftTopCorner(cX, sourceY, cornerSize);
                    secondCornerPath = bottomRightCorner(cX, targetY, cornerSize);
                }
            } else {
                if (targetPosition === Position.Right) {
                    // no change
                }
            }
        } else {
            firstCornerPath = topRightCorner(sourceX, cY, cornerSize);
            secondCornerPath = leftBottomCorner(targetX, cY, cornerSize);
            if (sourcePosition === Position.Left) {
                if (targetPosition === Position.Right) {
                    firstCornerPath = leftBottomCorner(cX, sourceY, cornerSize);
                    secondCornerPath = topRightCorner(cX, targetY, cornerSize);
                }
            } else {
                if (targetPosition === Position.Right) {
                    // no change
                }
            }
        }
    }

    return `M ${sourceX},${sourceY}${firstCornerPath}${secondCornerPath}L ${targetX},${targetY}`;
}
