import React, { memo, useEffect } from "react";
import {
    MiniMap as ReactFlowMiniMapV9,
    MiniMapProps as ReactFlowMiniMapV9Props,
    OnLoadParams
} from "react-flow-renderer";
import { FlowTransform } from "react-flow-renderer/dist/types";

import { ReacFlowVersionSupportProps, ReactFlowVersions, useReactFlowVersion } from "../versionsupport";

import { MiniMapV12, MiniMapV12Props } from "./MiniMapV12";
import { miniMapUtils } from "./utils";

export interface MiniMapBasicProps {
    /**
     * Enable navigating the react-flow canvas by dragging and clicking on the mini-map.
     */
    enableNavigation?: boolean;
    /**
     * Properties are forwarded to the HTML `div` element used as minimap wrapper.
     * Data attributes for test ids coud be included here.
     */
    wrapperProps?: Omit<
        React.HTMLAttributes<HTMLDivElement>,
        "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseLeave"
    >;
}

export interface MiniMapV9Props extends MiniMapBasicProps, ReactFlowMiniMapV9Props {
    /**
     * React-Flow instance
     */
    flowInstance?: OnLoadParams;
}

export type MiniMapProps = (ReacFlowVersionSupportProps & MiniMapV9Props) | (ReacFlowVersionSupportProps & MiniMapV12Props);

interface configParams {
    // Key has been pressed down over the mini-map and navigation mode has thus started
    navigationOn: boolean;
    // The mini-map element
    minimapElement: Element | null;
    // The react-flow element
    flowElement: Element | null;
}

let minimapCalcConf: configParams = {
    navigationOn: false,
    minimapElement: null,
    flowElement: null,
};

/** An improved mini-map for react-flow that supports navigation via the mini-map. */
export const MiniMap = memo(
    ({
        flowVersion,
        ...otherProps
    }: MiniMapProps) => {
        const flowVersionCheck = flowVersion || useReactFlowVersion();
        
        switch (flowVersionCheck) {
            case ReactFlowVersions.V9:
                return <MiniMapV9 {...otherProps as MiniMapV9Props} />;
            case ReactFlowVersions.V12:
                return <MiniMapV12 {...otherProps as MiniMapV12Props} />;
            default:
                return <></>; // cannot exit on its own
        }
    }
);

/**
 * Mini-map support for for React Flow v9.
 * @deprecated (v26) will be removed, use when `MiniMap` directly
 */
export const MiniMapV9 = memo(
    ({
        flowInstance,
        enableNavigation = false,
        maskColor = "#ddddddbb",
        nodeClassName = miniMapUtils.nodeClassName,
        nodeColor = miniMapUtils.nodeColor,
        nodeStrokeColor = miniMapUtils.borderColor,
        wrapperProps,
        ...minimapProps
    }: MiniMapV9Props) => {
        const minimapWrapper = React.useRef<HTMLDivElement | null>(null);

        useEffect(() => {
            const minimapDiv: HTMLDivElement | null = minimapWrapper.current;
            if (enableNavigation && flowInstance && minimapDiv) {
                minimapCalcConf = {
                    navigationOn: false,
                    minimapElement: minimapDiv.querySelector(".react-flow__minimap"),
                    flowElement: minimapDiv.closest(".react-flow"),
                };
            }
        }, [flowInstance, enableNavigation]);

        // sets the visible area of the canvas based on mouse movement on the mini-map
        const handleMiniMapMouseMove = (event: any) => {
            const minimapConfig = minimapCalcConf.minimapElement?.getAttribute("viewBox")?.split(" ");
            if (
                minimapCalcConf.navigationOn &&
                minimapCalcConf.minimapElement &&
                minimapCalcConf.flowElement &&
                flowInstance &&
                minimapConfig
            ) {
                const minimapBounds = minimapCalcConf.minimapElement.getBoundingClientRect();
                const canvasBounds = minimapCalcConf.flowElement.getBoundingClientRect();
                const instanceState = flowInstance.toObject();
                const minimapCoordinates = {
                    x0: parseInt(minimapConfig[0]),
                    y0: parseInt(minimapConfig[1]),
                    x1: parseInt(minimapConfig[2]) + parseInt(minimapConfig[0]),
                    y1: parseInt(minimapConfig[3]) + parseInt(minimapConfig[1]),
                };
                const minimapClick = {
                    x: event.clientX - minimapBounds.left,
                    y: event.clientY - minimapBounds.top,
                };
                const canvasPosition = {
                    x:
                        ((minimapCoordinates.x1 - minimapCoordinates.x0) / minimapBounds.width) * minimapClick.x * -1 -
                        minimapCoordinates.x0,
                    y:
                        ((minimapCoordinates.y1 - minimapCoordinates.y0) / minimapBounds.height) * minimapClick.y * -1 -
                        minimapCoordinates.y0,
                };
                const canvasNewState: FlowTransform = {
                    zoom: instanceState.zoom,
                    x: canvasPosition.x * instanceState.zoom + canvasBounds.width / 2,
                    y: canvasPosition.y * instanceState.zoom + canvasBounds.height / 2,
                };
                flowInstance.setTransform(canvasNewState);
            }
        };

        // sets the view for the user when clicked and finish navigation
        const handleMiniMapMouseUp = (event: any) => {
            handleMiniMapMouseMove(event);
            minimapCalcConf.navigationOn = false;
        };

        // enables the mini-map fake drag effect see "handleMiniMapMouseMove" above.
        const handleMiniMapMouseDown = () => {
            if (enableNavigation && flowInstance) {
                minimapCalcConf.navigationOn = true;
            }
        };

        return (
            <div
                ref={minimapWrapper}
                onMouseDown={handleMiniMapMouseDown}
                onMouseUp={handleMiniMapMouseUp}
                onMouseMove={handleMiniMapMouseMove}
                onMouseLeave={handleMiniMapMouseUp}
                {...wrapperProps}
                style={
                    flowInstance && enableNavigation
                        ? { ...(wrapperProps?.style ?? {}), cursor: "grab" }
                        : wrapperProps?.style
                }
            >
                <ReactFlowMiniMapV9
                    maskColor={maskColor}
                    nodeClassName={nodeClassName}
                    nodeColor={nodeColor}
                    nodeStrokeColor={nodeStrokeColor}
                    {...minimapProps}
                />
            </div>
        );
    }
);

export default MiniMap;