import React, { useEffect, memo } from "react";
import {
    MiniMap as ReactFlowMiniMap,
    MiniMapProps as ReactFlowMiniMapProps,
    OnLoadParams,
} from "react-flow-renderer";
import {FlowTransform} from "react-flow-renderer/dist/types";
import {
    minimapNodeClassName,
    minimapNodeColor,
    minimapBorderColor
} from "../minimap/utils";


export interface MiniMapProps extends ReactFlowMiniMapProps {
    flowInstance?: OnLoadParams;
    enableNavigation?: boolean;
}

interface configParams {
    // Key has been pressed down over the mini-map and navigation mode has thus started
    navigationOn: boolean;
    // The mini-map element
    minimapElement: Element | null;
    // The react-flow element
    flowElement: Element | null;
}

let minimapCalcConf: configParams  = {
    navigationOn: false,
    minimapElement: null,
    flowElement: null
};

/** An improved mini-map for react-flow that supports navigation via the mini-map. */
export const MiniMap = memo(({
    flowInstance,
    enableNavigation = false,
    maskColor = "#ddddddbb",
    nodeClassName = minimapNodeClassName,
    nodeColor = minimapNodeColor,
    nodeStrokeColor = minimapBorderColor,
    ...minimapProps
}: MiniMapProps) => {
    const minimapWrapper = React.useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const minimapDiv: HTMLDivElement | null = minimapWrapper.current
        if (enableNavigation && flowInstance && minimapDiv) {
            minimapCalcConf = {
                navigationOn: false,
                minimapElement: minimapDiv.querySelector(".react-flow__minimap"),
                flowElement: minimapDiv.closest(".react-flow"),
            }
        }
    }, [flowInstance, enableNavigation])

    // sets the visible area of the canvas based on mouse movement on the mini-map
    const handleMiniMapMouseMove = (event: any) => {
        const minimapConfig = minimapCalcConf.minimapElement?.getAttribute("viewBox")?.split(" ");
        if (minimapCalcConf.navigationOn && minimapCalcConf.minimapElement && minimapCalcConf.flowElement && flowInstance && minimapConfig) {
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

    /**
        sets the view for the user when clicked and finish navigation
     **/
    const handleMiniMapMouseUp = (event: any) => {
        handleMiniMapMouseMove(event);
        minimapCalcConf.navigationOn = false;
    };

    /**
        enables the mini-map fake drag effect see "handleMiniMapMouseMove" above.
     **/
    const handleMiniMapMouseDown = () => {
        if (enableNavigation && flowInstance) { minimapCalcConf.navigationOn = true; }
    };

    return (
        <div
            ref={minimapWrapper}
            onMouseDown={handleMiniMapMouseDown}
            onMouseUp={handleMiniMapMouseUp}
            onMouseMove={handleMiniMapMouseMove}
            onMouseLeave={handleMiniMapMouseUp}
            style={flowInstance ? { cursor: "grab" } : {}}
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
});
