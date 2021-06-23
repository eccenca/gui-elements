import React, { memo } from "react";
import { CLASSPREFIX as eccgui } from "@gui-elements/src/configuration/constants";
import { Icon } from "@gui-elements/index";
import {
    NodeProps as ReactFlowNodeProps,
    HandleProps,
    Handle,
    Position
} from "react-flow-renderer";

type HighlightingState = "success" | "warning" | "danger" | "match" | "altmatch";

export interface NodeContentProps {
    size?: "tiny" | "small" | "medium" | "large";
    minimalShape?: "none" | "circular" | "rectangular";
    highlightedState?: HighlightingState | HighlightingState[];
    iconName?: string;
    depiction?: string;
    typeLabel?: string;
    label: string;
    menuButtons?: React.ReactNode;
    content?: React.ReactNode;
    handles?: HandleProps[];
}

export interface NodeProps extends ReactFlowNodeProps /*, React.HTMLAttributes<HTMLElement> */ {
    data: NodeContentProps
}

const defaultHandles = [
    { type: "target",  position: Position.Left },
    { type: "source",  position: Position.Right },
] as HandleProps[];

const addHandles = (handles, position, posDirection, isConnectable) => {
    return handles[position].map((handle, idx) => {
        const style = {};
        style[posDirection] = (100 / (handles[position].length + 1) * (idx + 1)) + "%";
        const handleProperties = {
            ...handle,
            ...{
                position: handle.position ?? position,
                style,
                isConnectable: handle.isConnectable !== "undefined" ? handle.isConnectable : isConnectable,
            }
        };
        return (
            <Handle {...handleProperties} />
        );
    });
}

export const gethighlightedStateClasses = (state, baseClassName) => {
    let hightlights = typeof state === "string" ? [state] : state;
    return hightlights.map(item => `${baseClassName}--highlight-${item}`).join(' ');
}

export const NodeRectangular = memo(
    ({
        data,
        targetPosition = Position.Left,
        sourcePosition = Position.Right,
        isConnectable = true,
    }: NodeProps) => {
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
            handles,
        } = data;
        const handleStack = {};
        handleStack[Position.Top] = [] as HandleProps[];
        handleStack[Position.Right] = [] as HandleProps[];
        handleStack[Position.Bottom] = [] as HandleProps[];
        handleStack[Position.Left] = [] as HandleProps[];
        const handleCheck = typeof handles !== "undefined" ? handles : defaultHandles;
        if (handleCheck.length > 0) {
            handleCheck.forEach(handle => {
                if (!!handle.position) {
                    handleStack[handle.position].push(handle);
                } else {
                    if (handle.type === "target") {
                        handleStack[targetPosition].push(handle);
                    }
                    if (handle.type === "source") {
                        handleStack[sourcePosition].push(handle);
                    }
                }
            });
        }
        return (
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
                                {!!depiction && <img src={depiction} alt="" />}
                                {(!!iconName && !depiction) && <Icon name={iconName} tooltipText={typeLabel} />}
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
                {!!handleCheck && (
                    <>
                        { addHandles(handleStack, Position.Top, "left", isConnectable) }
                        { addHandles(handleStack, Position.Right, "top", isConnectable) }
                        { addHandles(handleStack, Position.Bottom, "left", isConnectable) }
                        { addHandles(handleStack, Position.Left, "top", isConnectable) }
                    </>
                )}
            </>
        );
    }
);
