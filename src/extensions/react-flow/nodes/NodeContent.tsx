import React from "react";
import { Position, useStoreState } from "react-flow-renderer";
import { Icon, Tooltip } from "../../../index";
import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import { ValidIconName } from "../../../components/Icon/canonicalIconNames";
import { HandleDefault, HandleProps } from "./../handles/HandleDefault";
import { NodeProps } from "./NodeDefault";
import { NodeContentExtensionProps } from "./NodeContentExtension";
import { Resizable } from "re-resizable";

export type HighlightingState = "success" | "warning" | "danger" | "match" | "altmatch";

export interface IHandleProps extends HandleProps {
    category?: "configuration";
}

export type NodeDimensions = {
    width: number;
    height: number;
};

interface NodeContentData<CONTENT_PROPS = any> {
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
    content?: React.ReactNode | ((adjustedContentProps: Partial<CONTENT_PROPS>) => React.ReactNode);
    /**
     * Content extension, displayed at the bottom side of a node.
     */
    contentExtension?: React.ReactElement<NodeContentExtensionProps>;
    /**
     * If submitted then the node will display footer element.
     */
    footerContent?: React.ReactNode;
}

export interface NodeContentProps<NODE_DATA, NODE_CONTENT_PROPS = any>
    extends NodeContentData,
        React.HTMLAttributes<HTMLDivElement> {
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
    executionButtons?: (
        adjustedContentProps: Partial<NODE_CONTENT_PROPS>,
        setAdjustedContentProps: React.Dispatch<React.SetStateAction<Partial<NODE_CONTENT_PROPS>>>
    ) => React.ReactElement<NODE_CONTENT_PROPS>;
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
    getMinimalTooltipData?: (node: NodeProps<NODE_DATA>) => NodeContentData;
    /**
     * Set if a handle is displayed even if it does not allow a connection to an edge.
     */
    showUnconnectableHandles?: boolean;
    /**
     * The node is displayed with some animated shadow for highlighting purposes.
     */
    animated?: boolean;

    /** Additional data stored in the node. */
    businessData?: NODE_DATA;

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
    /**
     * Allow react flow wheel events, e.g. for zooming using the mouse wheel over a node.
     * If this is allowed scrolling inside a node is not possible.
     */
    letPassWheelEvents?: boolean;
    /**
     * When set to true, allows nodes to be resized by dragging edges and sides
     */
    onNodeResize?: (data: NodeDimensions) => void;
    /**
     * width and height dimensions of the node (Optional)
     */
    nodeDimensions?: NodeDimensions;
}

interface MemoHandlerProps extends HandleProps {
    posdirection: string;
    style: {
        [key: string]: string | undefined;
    };
}

const defaultHandles = [{ type: "target" }, { type: "source" }] as IHandleProps[];

const getDefaultMinimalTooltipData = (node: any) => {
    return {
        label: node.data?.label,
        content: node.data?.content,
        iconName: node.data?.iconName,
        depiction: node.data?.depiction,
    };
};

const addHandles = (handles: any, position: any, posDirection: any, isConnectable: any, nodeStyle: any) => {
    return handles[position].map((handle: any, idx: any) => {
        const { className, style = {}, category } = handle;
        const styleAdditions: { [key: string]: string } = {
            color: nodeStyle.borderColor ?? undefined,
        };
        styleAdditions[posDirection] = (100 / (handles[position].length + 1)) * (idx + 1) + "%";
        const handleProperties = {
            ...handle,
            ...{
                position: handle.position ?? position,
                style: { ...style, ...styleAdditions },
                posdirection: posDirection,
                isConnectable: typeof handle.isConnectable !== "undefined" ? handle.isConnectable : isConnectable,
                className: !!category
                    ? (className ? className + " " : "") +
                      gethighlightedStateClasses(category, `${eccgui}-graphviz__handle`)
                    : className,
            },
        };
        return <MemoHandler {...handleProperties} key={"handle" + idx} />;
    });
};

const imgWithTooltip = (imgEl: any, tooltipText: any) => {
    if (!!tooltipText) {
        return (
            <Tooltip content={tooltipText}>
                <span>{imgEl}</span>
            </Tooltip>
        );
    }

    return imgEl;
};

export const gethighlightedStateClasses = (state: any, baseClassName: any) => {
    let hightlights = typeof state === "string" ? [state] : state;
    //@ts-ignore
    return hightlights.map((item) => `${baseClassName}--highlight-${item}`).join(" ");
};

const MemoHandler = React.memo(
    (props: MemoHandlerProps) => <HandleDefault {...props} />,
    (prev, next) => {
        const styleHasChanged = prev.style[prev.posdirection] === next.style[next.posdirection];
        return styleHasChanged;
    }
);

/**
 * The `NodeContent` element manages the main view of how a node is displaying which content.
 * This element cannot be used directly, all properties must be routed through the `data` property of an `elements` property item inside the `ReactFlow` container.
 */
export function NodeContent<CONTENT_PROPS = any>({
    iconName,
    depiction,
    typeLabel,
    label,
    showExecutionButtons = true,
    executionButtons,
    menuButtons,
    content,
    contentExtension,
     footerContent,
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
    onNodeResize,
    nodeDimensions,
    // forwarded props
    targetPosition = Position.Left,
    sourcePosition = Position.Right,
    isConnectable = true,
    selected,
    letPassWheelEvents = false,
    // businessData is just being ignored
    businessData,
    // other props for DOM element
    ...otherProps
}: NodeContentProps<any>) {
    const [width, setWidth] = React.useState<number>(nodeDimensions?.width ?? 0);
    const [height, setHeight] = React.useState<number>(nodeDimensions?.height ?? 0);
    const [, , zoom] = useStoreState((state) => state.transform);
    const [adjustedContentProps, setAdjustedContentProps] = React.useState<Partial<CONTENT_PROPS>>({});
    const nodeContentRef = React.useRef<any>();
    const handleStack: { [key: string]: IHandleProps[] } = {};
    handleStack[Position.Top] = [] as IHandleProps[];
    handleStack[Position.Right] = [] as IHandleProps[];
    handleStack[Position.Bottom] = [] as IHandleProps[];
    handleStack[Position.Left] = [] as IHandleProps[];

    // initial dimension before resize
    React.useEffect(() => {
        if (!!onNodeResize && minimalShape === "none") {
            if (!nodeDimensions) {
                setWidth(nodeContentRef.current.offsetWidth);
                setHeight(nodeContentRef.current.offsetHeight);
                onNodeResize({
                    height: nodeContentRef.current.offsetHeight,
                    width: nodeContentRef.current.offsetWidth,
                });
            }
            nodeContentRef.current.className = nodeContentRef.current.className + " is-resizeable";
        }
    }, [nodeContentRef, onNodeResize, minimalShape, nodeDimensions]);

    //update node dimensions when resized
    React.useEffect(() => {
        if (nodeDimensions) {
            setWidth(nodeDimensions.width);
            setHeight(nodeDimensions.height);
        }
    }, [nodeDimensions]);

    if (handles.length > 0) {
        handles.forEach((handle) => {
            if (!!handle.position) {
                handleStack[handle.position].push(handle);
            } else if (handle.category === "configuration") {
                handleStack[Position.Top].push(handle);
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
    const styleExpandDimensions: { [key: string]: string | number } = {};
    if (
        typeof adaptHeightForHandleMinCount !== "undefined" &&
        (minimalShape === "none" || !!selected) &&
        adaptSizeIncrement &&
        (handleStack[Position.Left].length >= adaptHeightForHandleMinCount ||
            handleStack[Position.Right].length >= adaptHeightForHandleMinCount)
    ) {
        const minHeightLeft = handleStack[Position.Left].length * adaptSizeIncrement;
        const minHeightRight = handleStack[Position.Right].length * adaptSizeIncrement;
        styleExpandDimensions["minHeight"] = Math.max(minHeightLeft, minHeightRight);
    }

    const resizableStyles = (!!onNodeResize === true && minimalShape === "none" && (width + height > 0)) ? { width, height } : {};
    const nodeContent = (
        <>
            <section
                ref={nodeContentRef}
                {...otherProps}
                style={{ ...style, ...styleExpandDimensions, ...resizableStyles }}
                className={
                    `${eccgui}-graphviz__node` +
                    ` ${eccgui}-graphviz__node--${size}` +
                    ` ${eccgui}-graphviz__node--minimal-${minimalShape}` +
                    (!!highlightedState
                        ? " " + gethighlightedStateClasses(highlightedState, `${eccgui}-graphviz__node`)
                        : "") +
                    (animated ? ` ${eccgui}-graphviz__node--animated` : "") +
                    (showUnconnectableHandles === false ? ` ${eccgui}-graphviz__node--hidehandles` : "") +
                    (letPassWheelEvents === false ? ` nowheel` : "")
                }
            >
                <header className={`${eccgui}-graphviz__node__header`}>
                    {(!!iconName || !!depiction) && (
                        <span className={`${eccgui}-graphviz__node__header-depiction`}>
                            {!!depiction &&
                                imgWithTooltip(
                                    <img src={depiction} alt="" />,
                                    minimalShape === "none" || selected ? typeLabel : undefined
                                )}
                            {!!iconName && !depiction && (
                                <Icon
                                    name={iconName}
                                    tooltipText={minimalShape === "none" || selected ? typeLabel : undefined}
                                />
                            )}
                        </span>
                    )}
                    <span className={`${eccgui}-graphviz__node__header-label`} title={label}>
                        {label}
                    </span>
                    {(menuButtons || (showExecutionButtons && executionButtons)) && (
                        <span className={`${eccgui}-graphviz__node__header-menu`}>
                            {showExecutionButtons && typeof executionButtons === "function"
                                ? executionButtons(adjustedContentProps, setAdjustedContentProps)
                                : null}
                            {menuButtons ?? null}
                        </span>
                    )}
                </header>
                {content && (
                    <div className={`${eccgui}-graphviz__node__content`}>
                        {typeof content === "function" ? content(adjustedContentProps) : content}
                    </div>
                )}
                {contentExtension}
                 {footerContent && (
                     <footer className={`${eccgui}-graphviz__node__footer`}>
                        { footerContent }
                     </footer>
                 )}
            </section>
            {!!handles && (
                <>
                    {addHandles(handleStack, Position.Top, "left", isConnectable, style)}
                    {addHandles(handleStack, Position.Right, "top", isConnectable, style)}
                    {addHandles(handleStack, Position.Bottom, "left", isConnectable, style)}
                    {addHandles(handleStack, Position.Left, "top", isConnectable, style)}
                </>
            )}
        </>
    );

    const resizableNode = () => (
        <Resizable
            className={`${eccgui}-graphviz__node__resizer`}
            handleWrapperClass={`${eccgui}-graphviz__node__resizer--cursorhandles nodrag`}
            size={{ height, width }}
            enable={{ bottomRight: true }}
            scale={zoom}
            onResize={(_0, _1, _2, d) => {
                if (nodeContentRef.current) {
                    nodeContentRef.current.style.width = width + d.width + "px";
                    nodeContentRef.current.style.height = height + d.height + "px";
                }
            }}
            onResizeStop={(_0, _1, _2, d) => {
                setWidth(width + d.width);
                setHeight(height + d.height);
                onNodeResize &&
                    onNodeResize({
                        height: height + d.height,
                        width: width + d.width,
                    });
            }}
        >
            {nodeContent}
        </Resizable>
    );

    return (!!onNodeResize && minimalShape === "none") ? resizableNode() : nodeContent;
}
