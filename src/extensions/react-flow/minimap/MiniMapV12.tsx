import React, { memo } from "react";
import { MiniMap as ReactFlowMiniMap, MiniMapProps as ReactFlowMiniMapProps } from "@xyflow/react";

import { MiniMapBasicProps } from "./MiniMap";
import { miniMapUtils } from "./utils";

/**
 * @deprecated (v27) will be removed when React Flow v9 can be removed
 */
export interface MiniMapV12Props extends MiniMapBasicProps, Omit<ReactFlowMiniMapProps, "maskColor"> {}

/**
 * Mini-map support for React Flow v12.
 * @deprecated (v27) will be removed when React Flow v9 can be removed
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
    },
);
