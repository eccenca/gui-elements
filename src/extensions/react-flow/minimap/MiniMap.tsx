import React, { useEffect, memo } from "react";
import {
    MiniMap as ReactFlowMiniMap,
    MiniMapProps as ReactFlowMiniMapProps,
    OnLoadParams,
} from "react-flow-renderer";

export interface MiniMapProps extends ReactFlowMiniMapProps {
    flowInstance?: OnLoadParams;
    enableNavigation?: boolean;
}

interface configParams {
    navigationOn: boolean;
    minimapEl?: any;
    flowEl?: any;
}

let minimapCalcConf: configParams  = {
    navigationOn: false,
};

export const MiniMap = memo(({
    flowInstance,
    enableNavigation = false,
    maskColor = "#ddddddbb",
    ...minimapProps
}: MiniMapProps) => {
    const minimapWrapper = React.useRef<any>(null);

    useEffect(() => {
        if (enableNavigation && flowInstance) {
            minimapCalcConf = {
                navigationOn: false,
                minimapEl: minimapWrapper.current.querySelector(".react-flow__minimap"),
                flowEl: minimapWrapper.current.closest(".react-flow"),
            }
        }
    }, [flowInstance])

    //sets the transform of the canvas based on mouse movement on the mini-map
    const handleMiniMapMouseMove = (event) => {
        if (minimapCalcConf.navigationOn) {
            const minimapBounds = minimapCalcConf.minimapEl?.getBoundingClientRect();
            const minimapConfig = minimapCalcConf.minimapEl?.getAttribute("viewBox").split(" ");
            const canvasBounds = minimapCalcConf.flowEl?.getBoundingClientRect();
            const instanceState = flowInstance?.toObject();
            if (minimapConfig && minimapBounds && canvasBounds && instanceState) {
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
                const canvasNewState = {
                    zoom: instanceState.zoom,
                    x: canvasPosition.x * instanceState.zoom + canvasBounds.width / 2,
                    y: canvasPosition.y * instanceState.zoom + canvasBounds.height / 2,
                };

                flowInstance?.setTransform(canvasNewState);
            }
        }
    };

    /**
        sets the view for the user when clicked and finish navigation
     **/
    const handleMiniMapMouseUp = (event) => {
        handleMiniMapMouseMove(event);
        minimapCalcConf.navigationOn = false;
    };

    /**
        enables the mini-map fake drag effect see "handleMiniMapMouseMove" above.
     **/
    const handleMiniMapMouseDown = (event) => {
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
            <ReactFlowMiniMap maskColor={maskColor} {...minimapProps} />
        </div>
    );
});
