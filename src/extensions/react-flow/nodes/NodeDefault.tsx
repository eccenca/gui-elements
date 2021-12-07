import React, { memo } from "react";
import {
    NodeProps as ReactFlowNodeProps,
    Position
} from "react-flow-renderer";
import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import { Icon, Tooltip } from "../../../../index";
import { HandleDefault, HandleProps } from "./../handles/HandleDefault";

type HighlightingState = "success" | "warning" | "danger" | "match" | "altmatch";

export interface IHandleProps extends HandleProps {
    category?: "configuration";
}

interface NodeContentData {
    iconName?: string;
    depiction?: string;
    label: string;
    content?: React.ReactNode;
}

export interface NodeContentProps<T> extends NodeContentData, React.HTMLAttributes<HTMLDivElement> {
    size?: "tiny" | "small" | "medium" | "large";
    minimalShape?: "none" | "circular" | "rectangular";
    highlightedState?: HighlightingState | HighlightingState[];
    typeLabel?: string;
    showExecutionButtons?: boolean;
    // For some still unknown reason this has to be a function instead of just a ReactNode. Else sometimes the nodes "froze".
    executionButtons?: () => React.ReactNode;
    menuButtons?: React.ReactNode;
    handles?: IHandleProps[];
    adaptHeightForHandleMinCount?: number;
    adaptSizeIncrement?: number;
    getMinimalTooltipData?: (node: NodeProps<T>) => NodeContentData;
    showUnconnectableHandles?: boolean;
    businessData?: T;
    animated?:boolean;
}

export interface NodeProps<T> extends ReactFlowNodeProps {
    data: NodeContentProps<T>
}

const defaultHandles = [
    { type: "target" },
    { type: "source" },
] as IHandleProps[];

interface MemoHandlerProps extends HandleProps {
     posdirection: string;
     style: {
        [key:string]: string | undefined
     }
}

const MemoHandler = React.memo(
    (props: MemoHandlerProps) => <HandleDefault {...props} />,
    (prev, next) => {
      const styleHasChanged =
        prev.style[prev.posdirection] === next.style[next.posdirection];
      return styleHasChanged;
    }
  );

  const addHandles = (handles: any, position: any, posDirection: any, isConnectable: any, nodeStyle: any) => {
      return handles[position].map((handle: any, idx: any) => {
          const {
              className,
              style = {},
              category,
          } = handle;
          const styleAdditions : {[key: string]: string}= {
              color: nodeStyle.borderColor ?? undefined
          }
          styleAdditions[posDirection] = (100 / (handles[position].length + 1) * (idx + 1)) + "%";
          const handleProperties = {
              ...handle,
              ...{
                  position: handle.position ?? position,
                  style: { ...style, ...styleAdditions},
                  posdirection: posDirection,
                  isConnectable: typeof handle.isConnectable !== "undefined" ? handle.isConnectable : isConnectable,
                  className: !!category ? (className?className+" ":"") + gethighlightedStateClasses(category, `${eccgui}-graphviz__handle`) : className,
              }
          };
          return (
              <MemoHandler {...handleProperties} key={"handle" + idx} />
          );
      });
  }

const getDefaultMinimalTooltipData = (node: any) => {
    return {
        label: node.data.label,
        content: node.data.content,
        iconName: node.data.iconName,
        depiction: node.data.depiction,
    }
}

const imgWithTooltip = (imgEl: any, tooltipText: any) => {
    if (!!tooltipText) {
        return <Tooltip content={tooltipText}><span>{imgEl}</span></Tooltip>;
    }

    return imgEl;
}

export const gethighlightedStateClasses = (state: any, baseClassName: any) => {
    let hightlights = typeof state === "string" ? [state] : state;
    //@ts-ignore
    return hightlights.map(item => `${baseClassName}--highlight-${item}`).join(' ');
}

export const NodeDefault = memo(
    (node: NodeProps<any>) => {
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
            showExecutionButtons = true,
            executionButtons,
            menuButtons,
            content,
            size = "small",
            minimalShape = "circular",
            highlightedState,
            handles = defaultHandles,
            adaptHeightForHandleMinCount = 0,
            adaptSizeIncrement = 15,
            getMinimalTooltipData = getDefaultMinimalTooltipData,
            style = {},
            showUnconnectableHandles = false,
            animated = false,
            // businessData is just being ignored
            businessData,
            ...otherProps
        } = data;
        const handleStack : {[key: string]: any } = {};
        handleStack[Position.Top] = [] as IHandleProps[];
        handleStack[Position.Right] = [] as IHandleProps[];
        handleStack[Position.Bottom] = [] as IHandleProps[];
        handleStack[Position.Left] = [] as IHandleProps[];
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
        const styleExpandDimensions: {[key: string]: any } = {};
        if (
            adaptHeightForHandleMinCount > 0 &&
            adaptSizeIncrement && (
                handleStack[Position.Left].length >= adaptHeightForHandleMinCount ||
                handleStack[Position.Right].length >= adaptHeightForHandleMinCount
            )
        ) {
            const minHeightLeft = handleStack[Position.Left].length * adaptSizeIncrement;
            const minHeightRight = handleStack[Position.Right].length * adaptSizeIncrement;
            styleExpandDimensions["minHeight"] = Math.max(minHeightLeft, minHeightRight);
        }
        const nodeEl = (
            <>
                <section
                    {...otherProps}
                    style={{...style, ...styleExpandDimensions}}
                    className={
                        `${eccgui}-graphviz__node` +
                        ` ${eccgui}-graphviz__node--${size}` +
                        ` ${eccgui}-graphviz__node--minimal-${minimalShape}` +
                        (!!highlightedState ? " " + gethighlightedStateClasses(highlightedState, `${eccgui}-graphviz__node`) : "") +
                        (animated ? ` ${eccgui}-graphviz__node--animated` : "") +
                        (showUnconnectableHandles === false ? ` ${eccgui}-graphviz__node--hidehandles` : "")
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
                            title={label}
                        >
                            {label}
                        </span>
                        {(menuButtons || (showExecutionButtons && executionButtons)) && (
                            <span
                                className={`${eccgui}-graphviz__node__header-menu`}
                            >
                                {(showExecutionButtons && typeof executionButtons === "function") ? executionButtons() : null}
                                {menuButtons??null}
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
                        { addHandles(handleStack, Position.Top, "left", isConnectable, style) }
                        { addHandles(handleStack, Position.Right, "top", isConnectable, style) }
                        { addHandles(handleStack, Position.Bottom, "left", isConnectable, style) }
                        { addHandles(handleStack, Position.Left, "top", isConnectable, style) }
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
