import React, {ReactElement, Ref} from "react";
import { KeyCode as KeyCodeV9 } from "react-flow-renderer";
import { KeyCode as KeyCodeV10 } from "react-flow-renderer-lts";
import { KeyCode as KeyCodeV12} from "@xyflow/react";

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
import { ReactFlowV12Container, ReactFlowV12ContainerProps } from "./ReactFlowV12";

export interface ReactFlowExtendedExtraProps {
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
     * If not set then v9 is used.
     */
    flowVersion?: ReactFlowVersions.V9;
}

interface ReactFlowExtendedVersion10SupportProps {
    /**
     * Set version of `ReactFlow` that is used internally.
     */
    flowVersion: ReactFlowVersions.V10;
}

interface ReactFlowExtendedVersion12SupportProps {
    /**
     * Set version of `ReactFlow` that is used internally.
     */
    flowVersion: ReactFlowVersions.V12;
    /**
     * Extra scroll on drag (pan on drag) support from our side should not be necessary anymore with v12.
     */
    scrollOnDrag?: never;
}

export type ReactFlowExtendedPropsV9 = ReactFlowExtendedVersion9SupportProps & ReactFlowV9ContainerProps & ReactFlowExtendedExtraProps & ReactFlowExtendedScrollProps
export type ReactFlowExtendedPropsV10 = ReactFlowExtendedVersion10SupportProps & ReactFlowV10ContainerProps & ReactFlowExtendedExtraProps & ReactFlowExtendedScrollProps
export type ReactFlowExtendedPropsV12 = ReactFlowExtendedVersion12SupportProps & ReactFlowV12ContainerProps & ReactFlowExtendedExtraProps

export type ReactFlowExtendedProps = ReactFlowExtendedPropsV9 | ReactFlowExtendedPropsV10 | ReactFlowExtendedPropsV12

/**
 * `ReactFlow` container extension that includes pre-configured nodes and edges for
 * Corporate Memory tools.
 *
 * @param T The concrete type of the corresponding version, i.e. either one of ReactFlowExtendedPropsV9, ReactFlowExtendedPropsV10 or ReactFlowExtendedPropsV12
 */
const ReactFlowExtendedPlain = <T extends ReactFlowExtendedProps>({
            configuration = "unspecified",
            flowVersion = ReactFlowVersions.V9,
            dropzoneFor,
            scrollOnDrag,
            children,
            className,
            selectionKeyCode,
            multiSelectionKeyCode,
            deleteKeyCode,
            zoomActivationKeyCode,
            ...originalProps
        }: T,
        outerRef: Ref<HTMLDivElement>
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

        let keyCodeConfig = {};
        switch (flowVersion) {
            case "v9":
                keyCodeConfig = {
                    selectionKeyCode: hotKeysDisabled ? undefined : (selectionKeyCode as KeyCodeV9),
                    deleteKeyCode: hotKeysDisabled ? undefined : (deleteKeyCode as KeyCodeV9),
                    multiSelectionKeyCode: hotKeysDisabled ? undefined : (multiSelectionKeyCode as KeyCodeV9),
                    zoomActivationKeyCode: hotKeysDisabled ? undefined : (zoomActivationKeyCode as KeyCodeV9),
                };
                break;
            case "v10":
                keyCodeConfig = {
                    selectionKeyCode: hotKeysDisabled ? undefined : (selectionKeyCode as KeyCodeV10),
                    deleteKeyCode: hotKeysDisabled ? undefined : (deleteKeyCode as KeyCodeV10),
                    multiSelectionKeyCode: hotKeysDisabled ? undefined : (multiSelectionKeyCode as KeyCodeV10),
                    zoomActivationKeyCode: hotKeysDisabled ? undefined : (zoomActivationKeyCode as KeyCodeV10),
                };
                break;
            case "v12":
                keyCodeConfig = {
                    selectionKeyCode: hotKeysDisabled ? null : (selectionKeyCode as KeyCodeV12),
                    deleteKeyCode: hotKeysDisabled ? null : (deleteKeyCode as KeyCodeV12),
                    multiSelectionKeyCode: hotKeysDisabled ? null : (multiSelectionKeyCode as KeyCodeV12),
                    zoomActivationKeyCode: hotKeysDisabled ? null : (zoomActivationKeyCode as KeyCodeV12),
                };
                break;
        }

        let scrollOnDragFunctions = {};
        switch (flowVersion) {
            case "v9":
                scrollOnDragFunctions = useReactFlowScrollOnDragV9({
                    reactFlowProps: (originalProps as unknown) as ReactFlowV9ContainerProps,
                    scrollOnDrag,
                });
                break;
            case "v10":
                scrollOnDragFunctions = useReactFlowScrollOnDragV10({
                    reactFlowProps: originalProps as ReactFlowV10ContainerProps,
                    scrollOnDrag,
                });
                break;
            // should not be necessary for v12
        }

        const containerConfig = {
            ...sharedProperties,
            ...keyCodeConfig,
            ...originalProps,
            ...scrollOnDragFunctions,
        };

        switch (flowVersion) {
            case "v9":
                return (
                    <ReactFlowV9Container ref={innerRef} {...((containerConfig as unknown) as ReactFlowV9ContainerProps)}>
                        {children}
                        <ReactFlowMarkers />
                    </ReactFlowV9Container>
                );
            case "v10":
                return (
                    <ReactFlowV10Container ref={innerRef} {...(containerConfig as ReactFlowV10ContainerProps)}>
                        {children}
                        <ReactFlowMarkers />
                    </ReactFlowV10Container>
                );
            case "v12":
                return (
                    <ReactFlowV12Container ref={innerRef} {...(containerConfig as ReactFlowV12ContainerProps)}>
                        {children}
                        <ReactFlowMarkers />
                    </ReactFlowV12Container>
                );
            default:
                return <div></div>;
        }
    }

/** Hack to make the Type Parameter work with the forward ref. */
export const ReactFlowExtended = React.forwardRef(ReactFlowExtendedPlain) as <T extends ReactFlowExtendedProps>(p: T & { ref?: Ref<HTMLDivElement> }) => ReactElement

    /**
 * @deprecated (v26) use `ReactFlowExtended`
 */
export const ReactFlow = ReactFlowExtended;

/** Classes that when set for an element, prevent that they trigger react-flow dragging, wheel and panning actions. */
export const preventReactFlowActionsClasses = "nodrag nopan nowheel"
