import React, { memo } from "react";
import {
    NodeProps as ReactFlowNodeProps,
    Position
} from "react-flow-renderer";
import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import { Icon, Tooltip } from "../../../../index";
import { HandleDefault, HandleProps } from "./../handles/HandleDefault";
import {ValidIconName} from "../../../components/Icon/canonicalIconNames";

type HighlightingState = "success" | "warning" | "danger" | "match" | "altmatch";

export interface IHandleProps extends HandleProps {
    category?: "configuration";
}

interface NodeContentData {
    /**
     * Name of icon that should be displayed before the node label.
     * Must be a name from our list of canonical icon names.
     */
    iconName?: ValidIconName;
    /**
     * Valid and accessible URL or `data-uri` for an image that should be displayed before the node label.
     */
    depiction?: string;
    /**
     * Label that is displayed in the node header.
     */
    label: string;
    /**
     * Content element, displayed in the node body.
     */
    content?: React.ReactNode;
    /**
     * Content extension, displayed at the bottom side of a node.
     */
    contentExtension?: React.ReactNode;
}

export interface NodeContentProps<T> extends NodeContentData, React.HTMLAttributes<HTMLDivElement> {
    /**
     * Size of the node.
     * If `minimalShape` is not set to `none`then the configured size definition is only used for the selected node state.
     */
    size?: "tiny" | "small" | "medium" | "large";
    /**
     * Defines if the node is initially displayed within a very small shape.
     * If not set to `none` then the node is only displayed in normal size when it is selected.
     */
    minimalShape?: "none" | "circular" | "rectangular";
    /**
     * Set the type of used highlights to mark the node.
     */
    highlightedState?: HighlightingState | HighlightingState[];
    /**
     * Text used for tooltip used on icon and depiction.
     */
    typeLabel?: string;
    /**
     * If `executionButtons` content is included or not.
     * It is displayed in the node header between label and menu.
     */
    showExecutionButtons?: boolean;
    // For some still unknown reason this has to be a function instead of just a ReactNode. Else sometimes the nodes "froze".
    /**
     * Set of defined buttons and icons that can be displayed.
     */
    executionButtons?: () => React.ReactNode;
    /**
     * Can be used for permanent action button or context menu.
     * It is displayed at the node header right to the label.
     */
    menuButtons?: React.ReactNode;
    /**
     * Array of property definition objects for `Handle` components that need to be created for the node.
     * @see https://reactflow.dev/docs/api/handle/
     */
    handles?: IHandleProps[];
    /**
     * Set the minimal number of handles on left or right side of the node to activate the recalculation of the minimal height of the node.
     */
    adaptHeightForHandleMinCount?: number;
    /**
     * Height per handle in px (without the unit) used for minimal height calculation of the node.
     */
    adaptSizeIncrement?: number;
    /**
     * Callback function to provide content for the tooltip on a node with a defined `minimalShape`.
     * If you do not want a tooltip in this state you need to provide a callback that returns an empty value.
     */
    getMinimalTooltipData?: (node: NodeProps<T>) => NodeContentData;
    /**
     * Set if a handle is displayed even if it does not allow a connection to an edge.
     */
    showUnconnectableHandles?: boolean;
    /**
     * The node is displayed with some animated shadow for highlighting purposes.
     */
    animated?:boolean;

    /** Additional data stored in the node. */
    businessData?: T;

    // we need to forward some ReactFlowNodeProps here

    /**
     * This property is only forwarded from the `NodeDefault` element.
     * If set then it will be always overwritten internally.
     */
    targetPosition?: typeof Position[keyof typeof Position];
    /**
     * This property is only forwarded from the `NodeDefault` element.
     * If set then it will be always overwritten internally.
     */
    sourcePosition?: typeof Position[keyof typeof Position];
    /**
     * This property is only forwarded from the `NodeDefault` element.
     * If set then it will be always overwritten internally.
     */
    isConnectable?: boolean;
    /**
     * This property is only forwarded from the `NodeDefault` element.
     * If set then it will be always overwritten internally.
     */
    selected?: boolean;
}

export interface NodeProps<T> extends ReactFlowNodeProps {
    /**
     * Contains all properties for our implementation of the React-Flow node.
     * For details pls see the `NodeContent` element documentation.
     */
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
        label: node.data?.label,
        content: node.data?.content,
        iconName: node.data?.iconName,
        depiction: node.data?.depiction,
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

/**
 * The `NodeDefault` element manages the display of React-Flow nodes.
 * This element cannot be used directly, it must be connected via a `nodeTypes` definition and all properties need to be routed through the `elements` property items inside the `ReactFlow` container.
 * @see https://reactflow.dev/docs/api/nodes/
 */
export const NodeDefault = memo(
    (node: NodeProps<any>) => {
        const {
            data,
            targetPosition = Position.Left,
            sourcePosition = Position.Right,
            isConnectable = true,
            selected
        } = node;

        const nodeEl = <NodeContent {...{...data, targetPosition, sourcePosition, isConnectable, selected}} />

        if (!selected && data?.minimalShape !== "none" && !!data?.getMinimalTooltipData) {
            const tooltipData = data?.getMinimalTooltipData(node);
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

/**
 * The `NodeContent` element manages the main view of how a node is displaying which content.
 * This element cannot be used directly, all properties must be routed through the `data` property of an `elements` property item inside the `ReactFlow` container.
 */
export const NodeContent = ({
    iconName,
    depiction,
    typeLabel,
    label,
    showExecutionButtons = true,
    executionButtons,
    menuButtons,
    content,
    contentExtension,
    size = "small",
    minimalShape = "circular",
    highlightedState,
    handles = defaultHandles,
    adaptHeightForHandleMinCount,
    adaptSizeIncrement = 15,
    getMinimalTooltipData = getDefaultMinimalTooltipData,
    style = {},
    showUnconnectableHandles = false,
    animated = false,
    // forwarded props
    targetPosition = Position.Left,
    sourcePosition = Position.Right,
    isConnectable = true,
    selected,
    // businessData is just being ignored
    businessData,
    // other props for DOM element
    ...otherProps
}: NodeContentProps<any>) => {
    const handleStack = {};
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
    const styleExpandDimensions = {};
    if (
        typeof adaptHeightForHandleMinCount !== "undefined" &&
        (minimalShape === "none" || !!selected) &&
        adaptSizeIncrement && (
            handleStack[Position.Left].length >= adaptHeightForHandleMinCount ||
            handleStack[Position.Right].length >= adaptHeightForHandleMinCount
        )
    ) {
        const minHeightLeft = handleStack[Position.Left].length * adaptSizeIncrement;
        const minHeightRight = handleStack[Position.Right].length * adaptSizeIncrement;
        styleExpandDimensions["minHeight"] = Math.max(minHeightLeft, minHeightRight);
    }
    return (
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
                            {!!depiction && imgWithTooltip(<img src={depiction} alt="" />, (minimalShape === "none" || selected) ? typeLabel : undefined)}
                            {(!!iconName && !depiction) && <Icon name={iconName} tooltipText={(minimalShape === "none" || selected) ? typeLabel : undefined} />}
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
                {contentExtension && (
                    <div className={`${eccgui}-graphviz__node__footer`}>
                        {contentExtension}
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
}
