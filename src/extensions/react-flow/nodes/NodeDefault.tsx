import React, { memo } from "react";
import { CLASSPREFIX as eccgui } from "@gui-elements/src/configuration/constants";
import { Icon, Tooltip } from "@gui-elements/index";
import {
    NodeProps as ReactFlowNodeProps,
    HandleProps as ReactFlowHandleProps,
    Handle,
    Position
} from "react-flow-renderer";

type HighlightingState = "success" | "warning" | "danger" | "match" | "altmatch";

interface HandleProps extends ReactFlowHandleProps {
    category?: "configuration";
}

interface NodeContentData {
    iconName?: string;
    depiction?: string;
    label: string;
    content?: React.ReactNode;
}

export interface NodeContentProps extends NodeContentData {
    size?: "tiny" | "small" | "medium" | "large";
    minimalShape?: "none" | "circular" | "rectangular";
    highlightedState?: HighlightingState | HighlightingState[];
    typeLabel?: string;
    menuButtons?: React.ReactNode;
    handles?: HandleProps[];
    getMinimalTooltipData?: (node: NodeProps) => NodeContentData;
}

export interface NodeProps extends ReactFlowNodeProps /*, React.HTMLAttributes<HTMLElement> */ {
    data: NodeContentProps
}

const defaultHandles = [
    { type: "target" },
    { type: "source" },
] as HandleProps[];

const addHandles = (handles, position, posDirection, isConnectable) => {
    return handles[position].map((handle, idx) => {
        const {
            className,
            style = {},
            category,
        } = handle;
        style[posDirection] = (100 / (handles[position].length + 1) * (idx + 1)) + "%";
        const handleProperties = {
            ...handle,
            ...{
                position: handle.position ?? position,
                style,
                isConnectable: typeof handle.isConnectable !== "undefined" ? handle.isConnectable : isConnectable,
                className: !!category ? (className?className+" ":"") + gethighlightedStateClasses(category, `${eccgui}-graphviz__handle`) : className,
            }
        };
        return (
            <Handle {...handleProperties} key={"handle" + idx} />
        );
    });
}

const getDefaultMinimalTooltipData = (node) => {
    return {
        label: node.data.label,
        content: node.data.content,
        iconName: node.data.iconName,
        depiction: node.data.depiction,
    }
}

const imgWithTooltip = (imgEl, tooltipText) => {
    if (!!tooltipText) {
        return <Tooltip content={tooltipText}><span>{imgEl}</span></Tooltip>;
    }

    return imgEl;
}

export const gethighlightedStateClasses = (state, baseClassName) => {
    let hightlights = typeof state === "string" ? [state] : state;
    return hightlights.map(item => `${baseClassName}--highlight-${item}`).join(' ');
}

export const NodeDefault = memo(
    (node: NodeProps) => {
        const {
            data,
            targetPosition = Position.Left,
            sourcePosition = Position.Right,
            isConnectable = true,
        } = node;
        const {
            iconName,
            depiction,
            typeLabel,
            label,
            menuButtons,
            content,
            size = "small",
            minimalShape = "circular",
            highlightedState,
            handles = defaultHandles,
            getMinimalTooltipData = getDefaultMinimalTooltipData,
        } = data;
        const handleStack = {};
        handleStack[Position.Top] = [] as HandleProps[];
        handleStack[Position.Right] = [] as HandleProps[];
        handleStack[Position.Bottom] = [] as HandleProps[];
        handleStack[Position.Left] = [] as HandleProps[];
        if (handles.length > 0) {
            handles.forEach(handle => {
                if (!!handle.position) {
                    handleStack[handle.position].push(handle);
                }
                else if (handle.category === "configuration") {
                    handleStack[Position.Top].push(handle);
                }
                else {
                    if (handle.type === "target") {
                        handleStack[targetPosition].push(handle);
                    }
                    if (handle.type === "source") {
                        handleStack[sourcePosition].push(handle);
                    }
                }
            });
        }
        const nodeEl = (
            <>
                <section
                    className={
                        `${eccgui}-graphviz__node` +
                        ` ${eccgui}-graphviz__node--${size}` +
                        ` ${eccgui}-graphviz__node--minimal-${minimalShape}` +
                        (!!highlightedState ? " " + gethighlightedStateClasses(highlightedState, `${eccgui}-graphviz__node`) : "")
                    }
                >
                    <header className={`${eccgui}-graphviz__node__header`}>
                        {(!!iconName || !!depiction) && (
                            <span
                                className={`${eccgui}-graphviz__node__header-depiction`}
                            >
                                {!!depiction && imgWithTooltip(<img src={depiction} alt="" />, (minimalShape === "none" || node.selected) ? typeLabel : undefined)}
                                {(!!iconName && !depiction) && <Icon name={iconName} tooltipText={(minimalShape === "none" || node.selected) ? typeLabel : undefined} />}
                            </span>
                        )}
                        <span
                            className={`${eccgui}-graphviz__node__header-label`}
                        >
                            {label}
                        </span>
                        {menuButtons && (
                            <span
                                className={`${eccgui}-graphviz__node__header-menu`}
                            >
                                {menuButtons}
                            </span>
                        )}
                    </header>
                    {content && (
                        <div className={`${eccgui}-graphviz__node__content`}>
                            {content}
                        </div>
                    )}
                </section>
                {!!handles && (
                    <>
                        { addHandles(handleStack, Position.Top, "left", isConnectable) }
                        { addHandles(handleStack, Position.Right, "top", isConnectable) }
                        { addHandles(handleStack, Position.Bottom, "left", isConnectable) }
                        { addHandles(handleStack, Position.Left, "top", isConnectable) }
                    </>
                )}
            </>
        );

        if (!node.selected && minimalShape !== "none" && !!getMinimalTooltipData) {
            const tooltipData = getMinimalTooltipData(node);
            if (!!tooltipData.label || !!tooltipData.content) {
                return (
                    <Tooltip
                        content={(
                            <>
                                {tooltipData.label && <div>{tooltipData.label}</div>}
                                {tooltipData.content && <div>{tooltipData.content}</div>}
                            </>
                        )}
                    >
                        {nodeEl}
                    </Tooltip>
                )
            }
        }

        return nodeEl;
    }
);
