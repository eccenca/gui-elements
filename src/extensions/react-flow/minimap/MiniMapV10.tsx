import React, { memo, useEffect } from "react";
import { MiniMap as ReactFlowMiniMap, MiniMapProps as ReactFlowMiniMapProps, ReactFlowInstance, XYPosition } from "react-flow-renderer-lts";
import { FlowTransform } from "react-flow-renderer/dist/types";

import { miniMapUtils } from "../minimap/utils";
import {Viewport} from "react-flow-renderer-lts/dist/esm/types/general";

export interface MiniMapV10Props extends ReactFlowMiniMapProps {
    /**
     * React-Flow instance
     */
    flowInstance?: ReactFlowInstance;
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
export const MiniMapV10 = memo(
    ({
        flowInstance,
        enableNavigation = false,
        maskColor = "#ddddddbb",
        nodeClassName = miniMapUtils.nodeClassName,
        nodeColor = miniMapUtils.nodeColor,
        nodeStrokeColor = miniMapUtils.borderColor,
        wrapperProps,
        ...minimapProps
    }: MiniMapV10Props) => {
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

        /** Changes the viewport of the react-flow view as given by the mini-maps canvas bounds. */
        const moveViewPort = React.useCallback((canvasBounds: DOMRect, canvasPosition: XYPosition) => {
            if(!flowInstance) {
                return
            }
            const zoom: number =  flowInstance.getZoom()
            const canvasNewState: FlowTransform & Viewport = {
                zoom,
                x: canvasPosition.x * zoom + canvasBounds.width / 2,
                y: canvasPosition.y * zoom + canvasBounds.height / 2,
            };
            const instanceStateV10 = flowInstance as ReactFlowInstance
            instanceStateV10.setViewport(canvasNewState)
        }, [flowInstance])

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
                const canvasBounds: DOMRect = minimapCalcConf.flowElement.getBoundingClientRect();

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
                moveViewPort(canvasBounds, canvasPosition)
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
                <ReactFlowMiniMap
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
