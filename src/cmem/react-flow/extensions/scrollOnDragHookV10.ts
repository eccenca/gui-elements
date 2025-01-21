import React, { MouseEvent as ReactMouseEvent, useCallback } from "react";
import {
    Edge,
    Node,
    OnInit,
    useStore,
    OnConnectStart,
    OnConnectStartParams,
    OnConnectStop,
    Transform,
    ReactFlowInstance,
} from "react-flow-renderer-lts";

import { ReactFlowV10ExtendedProps } from "../ReactFlow/ReactFlowV10";
import {HandleType} from "react-flow-renderer-lts/dist/esm/types/handles";
import { ReactFlowExtendedScrollProps } from "../ReactFlow/ReactFlow";
import { ScrollStateShared } from "./scrollOnDragHook";

interface IProps extends ReactFlowExtendedScrollProps {
    /** The original react-flow props. */
    reactFlowProps: ReactFlowV10ExtendedProps;
}

interface ScrollState extends ScrollStateShared {
    // The react-flow instance
    reactFlowInstance?: ReactFlowInstance;
}

type ReturnType = Pick<
    ReactFlowV10ExtendedProps,
    | "onInit"
    | "onNodeDragStart"
    | "onNodeDragStop"
    | "onConnectStart"
    | "onConnectStop"
    | "onSelectionDragStart"
    | "onSelectionDragStop"
    | "onEdgeUpdateStart"
    | "onEdgeUpdateEnd"
>;

/** Handles the scrolling of the react-flow canvas on all drag operations when the mouse pointer gets near or over the borders.
 * The return value contains the wrapped react-flow callback functions that need to be handed over to the react-flow component. */
export const useReactFlowScrollOnDragV10 = ({ reactFlowProps, scrollOnDrag }: IProps): ReturnType => {
    /** Tracks the zoom on drag to border functionality. */
    const scrollState = React.useRef<ScrollState>({
        reactFlowInstance: undefined,
        currentX: 0,
        currentY: 0,
        currentZoom: 1,
        loggedWarning: false,
        scrollX: false,
        scrollY: false,
        draggingOperationActive: false,
    });

    const useStoreStateInternal = (): Transform => {
        try {
            return useStore((state) => state.transform);
        } catch (ex) {
            if (reactFlowProps.id && scrollOnDrag) {
                // eslint-disable-next-line no-console
                console.warn("Scroll on drag is not correctly working. Reason: " + ex);
            }
            return [0, 0, 1];
        }
    };

    /** The current position and zoom factor of the view port. */
    const [currentX, currentY, currentZoom] = useStoreStateInternal();
    scrollState.current.currentX = currentX;
    scrollState.current.currentY = currentY;
    scrollState.current.currentZoom = currentZoom;

    const originalOnInit = reactFlowProps.onInit;
    const originalOnNodeDragStart = reactFlowProps.onNodeDragStart;
    const originalOnNodeDragStop = reactFlowProps.onNodeDragStop;
    const originalOnConnectStart = reactFlowProps.onConnectStart;
    const originalOnConnectStop = reactFlowProps.onConnectStop;
    const originalOnSelectionDragStart = reactFlowProps.onSelectionDragStart;
    const originalOnSelectionDragStop = reactFlowProps.onSelectionDragStop;
    const originalOnEdgeUpdateStart = reactFlowProps.onEdgeUpdateStart;
    const originalOnEdgeUpdateEnd = reactFlowProps.onEdgeUpdateEnd;

    const scrollInterval = scrollOnDrag?.scrollInterval;
    const scrollStepSize = scrollOnDrag?.scrollStepSize;

    const reactFlowInstanceId = reactFlowProps.id;

    const clearIntervalIfExists = React.useCallback(() => {
        if (scrollState.current.scrollTaskId) {
            clearInterval(scrollState.current.scrollTaskId);
        }
    }, []);

    const setScrolling = React.useCallback(
        (active: boolean) => {
            scrollState.current.draggingOperationActive = active;
            if (!active) {
                clearIntervalIfExists();
            }
        },
        [clearIntervalIfExists]
    );

    // Handle scrolling if any operation is active e.g. connecting or dragging a node
    React.useEffect(() => {
        if (scrollInterval && scrollStepSize && reactFlowInstanceId) {
            const handleScrolling = (event: MouseEvent) => {
                const state = scrollState.current;
                if (!state.draggingOperationActive) {
                    clearIntervalIfExists();
                    return;
                }
                // Check if mouse pointer is outside of the canvas
                const canvasElement = document.getElementById(reactFlowInstanceId);
                if (!canvasElement) {
                    if (!state.loggedWarning) {
                        // eslint-disable-next-line no-console
                        console.warn("No element found with ID " + reactFlowInstanceId);
                        state.loggedWarning = true;
                    }
                    return;
                }
                const boundingRect = canvasElement.getBoundingClientRect();
                const xStepSize = boundingRect.width * scrollStepSize;
                const yStepSize = boundingRect.height * scrollStepSize;
                if (
                    boundingRect.top > event.clientY ||
                    boundingRect.bottom < event.clientY ||
                    boundingRect.left > event.clientX ||
                    boundingRect.right < event.clientX
                ) {
                    const scrollX: number =
                        boundingRect.left > event.clientX
                            ? xStepSize
                            : boundingRect.right < event.clientX
                                ? -xStepSize
                                : 0;
                    const scrollY: number =
                        boundingRect.top > event.clientY
                            ? yStepSize
                            : boundingRect.bottom < event.clientY
                                ? -yStepSize
                                : 0;
                    if (state.scrollY === (scrollY !== 0) && state.scrollX === (scrollX !== 0)) {
                        // Nothing has changed, do not change interval function
                        return;
                    }
                    clearIntervalIfExists();
                    state.scrollTaskId = setInterval(() => {
                        state.reactFlowInstance?.setViewport({
                            x: state.currentX + scrollX,
                            y: state.currentY + scrollY,
                            zoom: state.currentZoom,
                        });
                    }, scrollInterval);
                } else {
                    clearIntervalIfExists();
                }
            };
            const disableScrollingOnMouseUp = () => {
                scrollState.current.draggingOperationActive = false;
                clearIntervalIfExists();
            };
            document.addEventListener("mousemove", handleScrolling);
            document.addEventListener("mouseup", disableScrollingOnMouseUp);
            return () => {
                document.removeEventListener("mousemove", handleScrolling);
                document.removeEventListener("mouseup", disableScrollingOnMouseUp);
            };
        } else {
            return undefined;
        }
    }, [scrollInterval, scrollStepSize, reactFlowInstanceId, clearIntervalIfExists]);

    const onInit: OnInit = useCallback(
        (rfi: ReactFlowInstance) => {
            scrollState.current.reactFlowInstance = rfi;
            originalOnInit?.(rfi);
        },
        [originalOnInit]
    );

    /** Wrap original callbacks to turn scrolling on and off. */
    const onConnectStart: OnConnectStart = React.useCallback(
        (event: ReactMouseEvent, params: OnConnectStartParams) => {
            setScrolling(true);
            originalOnConnectStart?.(event, params);
        },
        [originalOnConnectStart, setScrolling]
    );

    const onConnectStop: OnConnectStop = React.useCallback(
        (event: MouseEvent) => {
            setScrolling(false);
            originalOnConnectStop?.(event);
        },
        [originalOnConnectStop, setScrolling]
    );

    const onNodeDragStart = React.useCallback(
        (event: ReactMouseEvent, node: Node, nodes: Node[]) => {
            setScrolling(true);
            originalOnNodeDragStart?.(event, node, nodes);
        },
        [originalOnNodeDragStart, setScrolling]
    );

    const onNodeDragStop = React.useCallback(
        (event: ReactMouseEvent, node: Node, nodes: Node[]) => {
            setScrolling(false);
            originalOnNodeDragStop?.(event, node, nodes);
        },
        [originalOnNodeDragStop, setScrolling]
    );

    const onSelectionDragStart = React.useCallback(
        (event: ReactMouseEvent, nodes: Node[]) => {
            setScrolling(true);
            originalOnSelectionDragStart?.(event, nodes);
        },
        [originalOnSelectionDragStart, setScrolling]
    );

    const onSelectionDragStop = React.useCallback(
        (event: ReactMouseEvent, nodes: Node[]) => {
            setScrolling(false);
            originalOnSelectionDragStop?.(event, nodes);
        },
        [originalOnSelectionDragStop, setScrolling]
    );

    const onEdgeUpdateStart = React.useCallback(
        (event: ReactMouseEvent, edge: Edge, handleType: HandleType) => {
            setScrolling(true);
            originalOnEdgeUpdateStart?.(event, edge, handleType);
        },
        [originalOnEdgeUpdateStart, setScrolling]
    );

    const onEdgeUpdateEnd = React.useCallback(
        (event: MouseEvent, edge: Edge, handleType: HandleType) => {
            setScrolling(false);
            originalOnEdgeUpdateEnd?.(event, edge, handleType);
        },
        [originalOnEdgeUpdateEnd, setScrolling]
    );

    if (!reactFlowProps.id || !scrollOnDrag) {
        // No instance ID or config available, return empty object that will not overwrite any react-flow config parameters
        return {};
    } else {
        return {
            onInit,
            onNodeDragStart,
            onNodeDragStop,
            onConnectStart,
            onConnectStop,
            onSelectionDragStart,
            onSelectionDragStop,
            onEdgeUpdateStart,
            onEdgeUpdateEnd,
        };
    }
};
