import React, { memo } from "react";
import { MiniMap as ReactFlowMiniMap, MiniMapProps as ReactFlowMiniMapProps } from "@xyflow/react";

import { miniMapUtils } from "./utils";
import { MiniMapBasicProps } from "./MiniMap";

export interface MiniMapV12Props extends MiniMapBasicProps, Omit<ReactFlowMiniMapProps, "maskColor"> {
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
    }: MiniMapV12Props) => {
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
