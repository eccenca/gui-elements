import React from "react";
import { KeyCode as KeyCodeV9 } from "react-flow-renderer";
import { KeyCode as KeyCodeV10 } from "react-flow-renderer-lts";

import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import { ReactFlowMarkers } from "../../../extensions/react-flow/markers/ReactFlowMarkers";
import { ReactFlowVersions } from "../../../extensions/react-flow/versionsupport";
import { ReactFlowHotkeyContext } from "../extensions/ReactFlowHotkeyContext";
import { useReactFlowScrollOnDragV9 } from "../extensions/scrollOnDragHook";
import { useReactFlowScrollOnDragV10 } from "../extensions/scrollOnDragHookV10";

import * as graphConfig from "./../configuration/graph";
import * as linkingConfig from "./../configuration/linking";
import * as unspecifiedConfig from "./../configuration/unspecified";
import * as workflowConfig from "./../configuration/workflow";
import { ReactFlowV9Container, ReactFlowV9ContainerProps } from "./ReactFlowV9";
import { ReactFlowV10Container, ReactFlowV10ContainerProps } from "./ReactFlowV10";

export interface ReactFlowExtendedExraProps {
    /**
     * Load `ReactFlow` component with pre-configured values for `nodeTypes` and `edgeTypes`
     */
    configuration?: "unspecified" | "graph" | "workflow" | "linking";

    /**
     * Types data transfers that can be dragged in and dropped on the canvas.
     */
    dropzoneFor?: string[];
}

export interface ReactFlowExtendedScrollProps {
    /** If defined the canvas scrolls on all drag operations (node, selection, edge connect)
     * when the mouse pointer comes near the canvas borders or goes beyond them.
     * The `id` property of the ReactFlow component must be set in order for this to work.
     *
     * NOTE: If scrollOnDrag is defined, a ReactFlowProvider must be wrapped around this component (or a parent). */
    scrollOnDrag?: {
        /** Time in milliseconds to wait before the canvas scrolls the next step. */
        scrollInterval: number;
        /**
         * The size of each scroll step.
         * This should be a number between 0.0 - 1.0.
         * E.g. a value of 0.25 will lead to a scroll step size of a quarter of the visible canvas. */
        scrollStepSize: number;
    };
}

interface ReactFlowExtendedVersion9SupportProps {
    /**
     * Set version of `ReactFlow` that is used internally.
     */
    flowVersion?: ReactFlowVersions.V9;
}

interface ReactFlowExtendedVersion10SupportProps {
    /**
     * Set version of `ReactFlow` that is used internally.
     */
    flowVersion: ReactFlowVersions.V10;
}

export type ReactFlowExtendedProps =
    | (ReactFlowExtendedVersion9SupportProps &
          ReactFlowV9ContainerProps &
          ReactFlowExtendedExraProps &
          ReactFlowExtendedScrollProps)
    | (ReactFlowExtendedVersion10SupportProps &
          ReactFlowV10ContainerProps &
          ReactFlowExtendedExraProps &
          ReactFlowExtendedScrollProps);

/**
 * `ReactFlow` container extension that includes pre-configured nodes and edges for
 * Corporate Memory tools.
 */
export const ReactFlowExtended = React.forwardRef<HTMLDivElement, ReactFlowExtendedProps>(
    (
        {
            configuration = "unspecified",
            flowVersion,
            dropzoneFor,
            scrollOnDrag,
            children,
            className,
            selectionKeyCode,
            multiSelectionKeyCode,
            deleteKeyCode,
            zoomActivationKeyCode,
            ...originalProps
        },
        outerRef
    ) => {
        const innerRef = React.useRef<HTMLDivElement>(null);
        React.useImperativeHandle(outerRef, () => innerRef.current!, []);

        React.useEffect(() => {
            const reactflowContainer = innerRef?.current;

            if (reactflowContainer && dropzoneFor) {
                const addDragover = (event: DragEvent) => {
                    reactflowContainer.classList.add(`${eccgui}-graphviz__canvas--draghover`);
                    event.preventDefault();
                };

                const removeDragover = (event: DragEvent) => {
                    if (reactflowContainer === event.target) {
                        reactflowContainer.classList.remove(`${eccgui}-graphviz__canvas--draghover`);
                    }
                };

                reactflowContainer.addEventListener("dragover", addDragover);
                reactflowContainer.addEventListener("dragleave", removeDragover);
                reactflowContainer.addEventListener("drop", removeDragover);
                return () => {
                    reactflowContainer.removeEventListener("dragover", addDragover);
                    reactflowContainer.removeEventListener("dragleave", removeDragover);
                    reactflowContainer.removeEventListener("drop", removeDragover);
                };
            }
            return;
        }, [innerRef, dropzoneFor]);

        /** If the hot keys should be disabled. By default, they are always disabled. */
        const { hotKeysDisabled } = React.useContext(ReactFlowHotkeyContext);

        const configReactFlow = {
            unspecified: unspecifiedConfig,
            graph: graphConfig,
            workflow: workflowConfig,
            linking: linkingConfig,
        };

        const sharedProperties = {
            className: `${eccgui}-graphviz__canvas` + (className ? ` ${className}` : ""),
            nodeTypes: configReactFlow[configuration].nodeTypes,
            edgeTypes: configReactFlow[configuration].edgeTypes,
            "data-dropzone-for": dropzoneFor ? dropzoneFor.join(" ") : undefined,
        };

        const keyCodeConfig =
            flowVersion === "v10"
                ? {
                      selectionKeyCode: hotKeysDisabled ? undefined : (selectionKeyCode as KeyCodeV10),
                      deleteKeyCode: hotKeysDisabled ? undefined : (deleteKeyCode as KeyCodeV10),
                      multiSelectionKeyCode: hotKeysDisabled ? undefined : (multiSelectionKeyCode as KeyCodeV10),
                      zoomActivationKeyCode: hotKeysDisabled ? undefined : (zoomActivationKeyCode as KeyCodeV10),
                  }
                : {
                      selectionKeyCode: hotKeysDisabled ? undefined : (selectionKeyCode as KeyCodeV9),
                      deleteKeyCode: hotKeysDisabled ? undefined : (deleteKeyCode as KeyCodeV9),
                      multiSelectionKeyCode: hotKeysDisabled ? undefined : (multiSelectionKeyCode as KeyCodeV9),
                      zoomActivationKeyCode: hotKeysDisabled ? undefined : (zoomActivationKeyCode as KeyCodeV9),
                  };

        const scrollOnDragFunctions =
            flowVersion === "v10"
                ? useReactFlowScrollOnDragV10({
                      reactFlowProps: originalProps as ReactFlowV10ContainerProps,
                      scrollOnDrag,
                  })
                : useReactFlowScrollOnDragV9({
                      reactFlowProps: originalProps as ReactFlowV9ContainerProps,
                      scrollOnDrag,
                  });

        const containerConfig = {
            ...sharedProperties,
            ...keyCodeConfig,
            ...originalProps,
            ...scrollOnDragFunctions,
        };

        return flowVersion === "v10" ? (
            <ReactFlowV10Container ref={innerRef} {...(containerConfig as ReactFlowV10ContainerProps)}>
                {children}
                <ReactFlowMarkers />
            </ReactFlowV10Container>
        ) : (
            <ReactFlowV9Container ref={innerRef} {...(containerConfig as ReactFlowV9ContainerProps)}>
                {children}
                <ReactFlowMarkers />
            </ReactFlowV9Container>
        );
    }
);

/**
 * @deprecated (v26) use `ReactFlowExtended`
 */
export const ReactFlow = ReactFlowExtended;
