import React, { memo } from "react";
import { MiniMap as ReactFlowMiniMap, MiniMapProps as ReactFlowMiniMapProps } from "@xyflow/react";

import { miniMapUtils } from "../minimap/utils";

export interface MiniMapV10Props extends Omit<ReactFlowMiniMapProps, "maskColor"> {
    /**
     * Enable navigating the react-flow canvas by dragging and clicking on the mini-map.
     */
    enableNavigation?: boolean;
    /**
     * Properties are forwarded to the HTML `div` element used as minimap wrapper.
     * Data attributes for test ids could be included here.
     */
    wrapperProps?: Omit<
        React.HTMLAttributes<HTMLDivElement>,
        "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseLeave"
    >;
}

/**
 * Mini-map support for for React Flow v12.
 * @deprecated (v26) will be removed when `MiniMap` supports v12 directly
 */
export const MiniMapV12 = memo(
    ({
        enableNavigation = false,
        nodeClassName = miniMapUtils.nodeClassName,
        nodeColor = miniMapUtils.nodeColor,
        nodeStrokeColor = miniMapUtils.borderColor,
        wrapperProps,
        ...minimapProps
    }: MiniMapV10Props) => {
        return (
            <div
                {...wrapperProps}
                style={enableNavigation ? { ...(wrapperProps?.style ?? {}), cursor: "grab" } : wrapperProps?.style}
            >
                <ReactFlowMiniMap
                    nodeClassName={nodeClassName}
                    nodeColor={nodeColor}
                    nodeStrokeColor={nodeStrokeColor}
                    {...minimapProps}
                    zoomable={enableNavigation}
                    pannable={enableNavigation}
                />
            </div>
        );
    }
);
