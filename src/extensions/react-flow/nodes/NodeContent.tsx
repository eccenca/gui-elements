import React from "react";
import { Position, useStoreState as getStoreStateFlowLegacy } from "react-flow-renderer";
import { useStore as getStoreStateFlowNext } from "react-flow-renderer-lts";
import { useStore as useStoreFlowV12 } from "@xyflow/react";
import Color from "color";
import { Resizable } from "re-resizable";

import { intentClassName, IntentTypes } from "../../../common/Intent";
import { DepictionProps } from "../../../components";
import { ValidIconName } from "../../../components/Icon/canonicalIconNames";
import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import {Depiction, HandleDefaultProps, Icon, OverflowText} from "../../../index";
import { HandleDefault, HandleNextProps, HandleV12Props,  HandleProps } from "../handles/HandleDefault";
import { ReacFlowVersionSupportProps, useReactFlowVersion } from "../versionsupport";

import { NodeContentExtensionProps } from "./NodeContentExtension";
import { NodeDefaultProps } from "./NodeDefault";
import { NodeHighlightColor } from "./sharedTypes";

type NodeContentHandleLegacyProps = HandleProps;

type NodeContentHandleNextProps = HandleNextProps;

type NodeContentHandleV12Props = HandleV12Props;

export type NodeContentHandleProps = NodeContentHandleLegacyProps | NodeContentHandleNextProps | NodeContentHandleV12Props;

export type NodeDimensions = {
    width?: number;
    height?: number;
};

type ResizeDirections =
    | { right: true; bottom?: false }
    | { right?: false; bottom: true }
    | { right: true; bottom: true };

type IntroductionTime = {
    /**
     * The delay time in ms before the introduction animation is displayed.
     * Until the animation starts the node is invisible.
     */
    delay?: number;
    /**
     * The time in ms the introdcution animation runs.
     */
    run: number;
    /**
     * Animation used for the visual introduction.
     * `outline` is used as default animation.
     */
    animation?: "landing" | "outline";
};

interface NodeContentData<CONTENT_PROPS = any> {
    /**
     * Name of icon that should be displayed before the node label.
     * Must be a name from our list of canonical icon names.
     */
    iconName?: ValidIconName;
    /**
     * Depiction element that should be displayed before the node label.
     * As alternative a valid and accessible URL or `data-uri` for an image can be set, then the Depiction element is created automatically.
     */
    depiction?: string | React.ReactElement<DepictionProps>;
    /**
     * Any element that should be displayed as depiction before the node label.
     */
    leftElement?: JSX.Element;
    /**
     * Label that is displayed in the node header.
     */
    label: string | JSX.Element;
    /**
     * Element that is displayed as subline under the label in the header.
     */
    labelSubline?: JSX.Element;
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
        ReacFlowVersionSupportProps,
        Omit<React.HTMLAttributes<HTMLDivElement>, "content"> {
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
     * Stretches the node to the full available width.
     */
    fullWidth?: boolean;
    /**
     * Increase the hight of the node header.
     * Use this for example if you need more space for a label subline.
     * Also the depiction is displayed larger.
     */
    enlargeHeader?: boolean;
    /**
     * Defines how the borders of a node are displayed.
     * Use this property to overwrite default styles.
     * You can use this to visuaize different states or type without depending only on color.
     */
    border?: "solid" | "double" | "dashed" | "dotted";
    /**
     * Feedback state of the node.
     */
    intent?: IntentTypes;
    /**
     * Set the type of used highlights to mark the node.
     */
    highlightColor?: NodeHighlightColor | [NodeHighlightColor, NodeHighlightColor];
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
    handles?: NodeContentHandleLegacyProps[] | NodeContentHandleNextProps[] | NodeContentHandleV12Props[];
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
    getMinimalTooltipData?: (node: NodeDefaultProps<NODE_DATA>) => NodeContentData;
    /**
     * Set if a handle is displayed even if it does not allow a connection to an edge.
     */
    showUnconnectableHandles?: boolean;
    /**
     * The node is displayed with some animated shadow for highlighting purposes.
     */
    animated?: boolean;
    /**
     * Time in ms used for a short animation of the node to visualize it was added or updated.
     */
    introductionTime?: number | IntroductionTime;

    /** Additional data stored in the node. */
    businessData?: NODE_DATA;

    // we need to forward some ReactFlowNodeProps here

    /**
     * This property is only forwarded from the `NodeDefault` element.
     * If set then it will be always overwritten internally.
     */
    targetPosition?: (typeof Position)[keyof typeof Position];
    /**
     * This property is only forwarded from the `NodeDefault` element.
     * If set then it will be always overwritten internally.
     */
    sourcePosition?: (typeof Position)[keyof typeof Position];
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
    /** if node is resizable, this allows direction of specificity */
    resizeDirections?: ResizeDirections;
    /** determines how much width a node can be resized to */
    resizeMaxDimensions?: Partial<NodeDimensions>;
}

interface MemoHandlerLegacyProps extends HandleProps {
    posdirection: string;
    style: {
        [key: string]: string | undefined;
    };
}

interface MemoHandlerNextProps extends HandleNextProps {
    posdirection: string;
    style: {
        [key: string]: string | undefined;
    };
}

type MemoHandlerProps = MemoHandlerLegacyProps | MemoHandlerNextProps;

const defaultHandles = (flowVersion: ReacFlowVersionSupportProps["flowVersion"]): NodeContentHandleProps[] => {
    switch (flowVersion) {
        case "legacy":
            return [{ type: "target" }, { type: "source" }] as NodeContentHandleLegacyProps[];
        case "next":
            return [{ type: "target" }, { type: "source" }] as NodeContentHandleNextProps[];
        case "v12":
            return [{ type: "target" }, { type: "source" }] as NodeContentHandleV12Props[];

        default:
            return [];
    }
};

const getDefaultMinimalTooltipData = (node: any) => {
    return {
        label: node.data?.label,
        content: node.data?.content,
        iconName: node.data?.iconName,
        depiction: node.data?.depiction,
    };
};

const addHandles = (
    handles: any,
    position: any,
    posDirection: any,
    isConnectable: any,
    nodeStyle: any,
    flowVersion: any = "legacy"
) => {
    return handles[position].map((handle: any, idx: any) => {
        const { style = {}, ...otherHandleProps } = handle;
        const styleAdditions: { [key: string]: string } = {
            color: nodeStyle.borderColor ?? undefined,
        };
        styleAdditions[posDirection] = (100 / (handles[position].length + 1)) * (idx + 1) + "%";
        const handleProperties = {
            ...otherHandleProps,
            ...{
                position: handle.position ?? position,
                style: { ...style, ...styleAdditions },
                posdirection: posDirection,
                isConnectable: typeof handle.isConnectable !== "undefined" ? handle.isConnectable : isConnectable,
            },
        };
        return <MemoHandler flowVersion={flowVersion} {...handleProperties} key={"handle" + idx} />;
    });
};

const MemoHandler = React.memo(
    (props: MemoHandlerProps) => <HandleDefault {...props} />,
    (prev, next) => {
        return (
            // we only test a few properties to control re-rendering
            // need to be extended if also other properties need to be changed late
            prev.style[prev.posdirection] === next.style[next.posdirection] &&
            prev.isConnectable === next.isConnectable &&
            prev.intent === next.intent &&
            prev.category === next.category
        );
    }
);

/**
 * The `NodeContent` element manages the main view of how a node is displaying which content.
 * This element cannot be used directly, all properties must be routed through the `data` property of an `elements` property item inside the `ReactFlow` container.
 */
export function NodeContent<CONTENT_PROPS = any>({
    flowVersion,
    iconName,
    depiction,
    leftElement,
    typeLabel,
    label,
    labelSubline,
    enlargeHeader,
    fullWidth,
    showExecutionButtons = true,
    executionButtons,
    menuButtons,
    content,
    contentExtension,
    footerContent,
    size = "small",
    minimalShape = "circular",
    intent,
    border,
    highlightColor,
    //handles = defaultHandles(),
    adaptHeightForHandleMinCount,
    adaptSizeIncrement = 15,
    // FIXME: getMinimalTooltipData is just being ignored, only used in `NodeDefault`
    getMinimalTooltipData = getDefaultMinimalTooltipData,
    style = {},
    showUnconnectableHandles = false,
    animated = false,
    introductionTime = 0,
    // resizing
    onNodeResize,
    nodeDimensions,
    resizeDirections = { bottom: true, right: true },
    resizeMaxDimensions,
    // forwarded props
    targetPosition = Position.Left,
    sourcePosition = Position.Right,
    isConnectable = true,
    selected,
    letPassWheelEvents = false,
    // FIXME: businessData is just being ignored
    businessData,
    // other props for DOM element
    ...otherDomProps
}: NodeContentProps<any>) {
    const evaluateFlowVersion = useReactFlowVersion();
    const flowVersionCheck = flowVersion || evaluateFlowVersion;
    const [introductionDone, setIntroductionDone] = React.useState(false);

    const { handles = defaultHandles(flowVersionCheck), ...otherProps } = otherDomProps;

    const hasValidResizeDirection = resizeDirections.bottom || resizeDirections.right;
    const isResizable = typeof onNodeResize === "function" && hasValidResizeDirection && minimalShape === "none";

    const [width, setWidth] = React.useState<number | undefined>(nodeDimensions?.width ?? undefined);
    const [height, setHeight] = React.useState<number | undefined>(nodeDimensions?.height ?? undefined);
    // Keeps the initial size of the element
    const originalSize = React.useRef<NodeDimensions>({})

    let zoom = 1;
    if (isResizable)
        try {
            switch (flowVersionCheck) {
                case "legacy":
                    [, , zoom] = getStoreStateFlowLegacy((state) => state.transform);
                    break;
                case "next":
                    [, , zoom] = getStoreStateFlowNext((state) => state.transform);
                    break;
                case "v12":
                    // we are calling a hook here conditionally. Not recommended, by the flowversion check is
                    // is basically compile time determined. So we just do it.
                    [, , zoom] = useStoreFlowV12((state) => state.transform);
                    break;
            }
        } catch (error) {
            // do not handle error but at least push it to the console
            // eslint-disable-next-line no-console
            console.error(error);
        }
    const [adjustedContentProps, setAdjustedContentProps] = React.useState<Partial<CONTENT_PROPS>>({});
    const nodeContentRef = React.useRef<any>();

    const handleStack: Record<string, HandleDefaultProps[]> = {
        [Position.Top]: [],
        [Position.Right]:  [],
        [Position.Bottom]:[],
        [Position.Left]:[],
    };

    const saveOriginalSize = () => {
        const currentClassNames = nodeContentRef.current.classList;
        if (currentClassNames.contains("was-resized") && !width && !height) {
            currentClassNames.remove("was-resized");
        }
        originalSize.current.width = nodeContentRef.current.offsetWidth as number;
        originalSize.current.height = nodeContentRef.current.offsetHeight as number;
    }

    React.useEffect(() => {
        if(nodeContentRef.current && (!(originalSize.current.width || originalSize.current.height) || !(width || height))) {
            saveOriginalSize();
        }
    }, [!!nodeContentRef.current, !(originalSize.current.width || originalSize.current.height), !(width || height)])

    // Update width and height when node dimensions parameters has changed
    React.useEffect(() => {
        const updateWidth = nodeDimensions?.width ? validateWidth(nodeDimensions?.width) : undefined;
        const updateHeight = nodeDimensions?.height ? validateHeight(nodeDimensions?.height) : undefined;
        setWidth(updateWidth);
        setHeight(updateHeight);
    }, [nodeDimensions]);

    const isResizingActive = React.useCallback((): boolean => {
        const currentClassNames = nodeContentRef.current.classList;
        return resizeDirections.right === currentClassNames.contains("is-resizable-horizontal") ||
            resizeDirections.bottom === currentClassNames.contains("is-resizable-vertical");
    }, [])

    // force default size when resizing is activated but no dimensions are set
    React.useEffect(() => {
        const resizingActive = isResizingActive();

        if (isResizable && !resizingActive) {
            if (!width || !height) {
                const newWidth = validateWidth(width ?? originalSize.current?.width as number);
                const newHeight = validateHeight(height ?? originalSize.current?.height as number);
                setWidth(newWidth);
                setHeight(newHeight);
            }
        }
    }, [nodeContentRef.current, onNodeResize, minimalShape, resizeDirections?.bottom, resizeDirections?.right, width, height]); // need to be done everytime a property is changed and the element is re-rendered, otherwise the resizing class is lost

    // conditional enhancements for activated resizing
    React.useEffect(() => {
        const currentClassNames = nodeContentRef.current.classList;
        const resizingActive = isResizingActive();

        if (isResizable && !resizingActive) {
            if (currentClassNames.contains("is-resizable-horizontal")) {
                currentClassNames.remove("is-resizable-horizontal");
            }
            if (currentClassNames.contains("is-resizable-vertical")) {
                currentClassNames.remove("is-resizable-vertical");
            }

            if (resizeDirections.right) {
                currentClassNames.add("is-resizable-horizontal");
            }
            if (resizeDirections.bottom) {
                currentClassNames.add("is-resizable-vertical");
            }
        }
    }); // need to be done everytime a property is changed and the element is re-rendered, otherwise the resizing class is lost

    // remove introduction class
    React.useEffect(() => {
        if (nodeContentRef && introductionTime) {
            const timeDelay = typeof introductionTime === "object" ? introductionTime.delay ?? 0 : 0;
            const timeRun = typeof introductionTime === "object" ? introductionTime.run : introductionTime;
            setTimeout(() => {
                nodeContentRef.current.className = nodeContentRef.current.className.replace(
                    `${eccgui}-graphviz__node--introduction`,
                    `${eccgui}-graphviz__node--introduction-runs`
                );
            }, timeDelay);
            setTimeout(() => {
                nodeContentRef.current.className = nodeContentRef.current.className.replace(
                    `${eccgui}-graphviz__node--introduction-runs`,
                    `${eccgui}-graphviz__node--introduction-done`
                );
                setIntroductionDone(true);
            }, timeDelay + timeRun);
        }
    }, [nodeContentRef, introductionTime]);

    if (handles.length > 0) {
        handles
            .sort((a, b) => {
                if (a.category === "dependency") {
                    return 1;
                }
                if (b.category === "dependency") {
                    return -1;
                }
                return 0;
            })
            .forEach((handle) => {
                if (handle.position) {
                    handleStack[handle.position].push(handle);
                }
                //TODO sth. seems to be broken here. typescript indicates, that position is always defined.
                // either the types are incorrect or this is dead code.
                /*
                else if ("category" in handle && handle.category === "configuration") {
                    handleStack[Position.Top].push(handle);
                } else {
                    if (handle.type === "target") {
                        handleStack[targetPosition].push(handle);
                    }
                    if (handle.type === "source") {
                        handleStack[sourcePosition].push(handle);
                    }
                }*/
            });
    }
    const styleExpandDimensions: { [key: string]: string | number } = Object.create(null);
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

    const { highlightClassNameSuffix, highlightCustomPropertySettings } = evaluateHighlightColors(
        "--node-highlight",
        highlightColor
    );

    const resizableStyles =
        isResizable && (width ?? 0) + (height ?? 0) > 0
            ? {
                  width,
                  height,
                  maxWidth: resizeDirections.right ? resizeMaxDimensions?.width ?? undefined : undefined,
                  maxHeight: resizeDirections.bottom ? resizeMaxDimensions?.height ?? undefined : undefined,
              }
            : {};

    const introductionStyles =
        introductionTime && !introductionDone
            ? ({
                  "--node-introduction-time": `${
                      typeof introductionTime === "object" ? introductionTime.run : introductionTime
                  }ms`,
              } as React.CSSProperties)
            : {};

    const nodeContent = (
        <>
            <section
                ref={nodeContentRef}
                {...otherProps}
                style={{
                    ...style,
                    ...highlightCustomPropertySettings,
                    ...styleExpandDimensions,
                    ...resizableStyles,
                    ...introductionStyles,
                }}
                className={
                    `${eccgui}-graphviz__node` +
                    ` ${eccgui}-graphviz__node--${size}` +
                    ` ${eccgui}-graphviz__node--minimal-${minimalShape}` +
                    (fullWidth ? ` ${eccgui}-graphviz__node--fullwidth` : "") +
                    (border ? ` ${eccgui}-graphviz__node--border-${border}` : "") +
                    (intent ? ` ${intentClassName(intent)}` : "") +
                    (highlightClassNameSuffix.length > 0
                        ? highlightClassNameSuffix
                              .map((highlight) => ` ${eccgui}-graphviz__node--highlight-${highlight}`)
                              .join("")
                        : "") +
                    (animated ? ` ${eccgui}-graphviz__node--animated` : "") +
                    (introductionTime && !introductionDone ? ` ${eccgui}-graphviz__node--introduction` : "") +
                    (showUnconnectableHandles === false ? ` ${eccgui}-graphviz__node--hidehandles` : "") +
                    (letPassWheelEvents === false ? ` nowheel` : "")
                }
                data-introduction-animation={
                    typeof introductionTime === "object" && !introductionDone ? introductionTime.animation : undefined
                }
            >
                <header
                    className={
                        `${eccgui}-graphviz__node__header` +
                        (enlargeHeader && minimalShape === "none" ? ` ${eccgui}-graphviz__node__header--large` : "")
                    }
                >
                    {(!!iconName || !!depiction || !!leftElement) && (
                        <div className={`${eccgui}-graphviz__node__header-depiction`}>
                            {leftElement}
                            {!!depiction && !leftElement && typeof depiction === "string" && (
                                <Depiction
                                    image={<img src={depiction} alt="" />}
                                    caption={minimalShape === "none" || selected ? typeLabel : undefined}
                                    captionPosition="tooltip"
                                    padding="tiny"
                                    ratio="1:1"
                                    resizing="contain"
                                    forceInlineSvg
                                />
                            )}
                            {!!depiction &&
                                !leftElement &&
                                typeof depiction !== "string" &&
                                React.cloneElement(depiction, {
                                    caption: minimalShape === "none" || selected ? typeLabel : undefined,
                                    captionPosition: "tooltip",
                                    padding: "tiny",
                                    ratio: "1:1",
                                    resizing: "contain",
                                    forceInlineSvg: true,
                                })}
                            {!!iconName && !leftElement && !depiction && (
                                <Depiction
                                    image={<Icon name={iconName} />}
                                    caption={minimalShape === "none" || selected ? typeLabel : undefined}
                                    captionPosition="tooltip"
                                    padding="tiny"
                                    ratio="1:1"
                                    resizing="contain"
                                    forceInlineSvg
                                />
                            )}
                        </div>
                    )}
                    <div
                        className={`${eccgui}-graphviz__node__header-label`}
                        title={typeof label === "string" ? label : undefined}
                    >
                        {typeof label === "string" ? (
                            <OverflowText className={`${eccgui}-graphviz__node__header-label__mainline`}>
                                {label}
                            </OverflowText>
                        ) : (
                            <div className={`${eccgui}-graphviz__node__header-label__mainline`}>{label}</div>
                        )}
                        {!!labelSubline && (
                            <div className={`${eccgui}-graphviz__node__header-label__subline`}>{labelSubline}</div>
                        )}
                    </div>
                    {(menuButtons || (showExecutionButtons && executionButtons)) && (
                        <div className={`${eccgui}-graphviz__node__header-menu`}>
                            {showExecutionButtons && typeof executionButtons === "function"
                                ? executionButtons(adjustedContentProps, setAdjustedContentProps)
                                : null}
                            {menuButtons ?? null}
                        </div>
                    )}
                </header>
                {content && (
                    <div className={`${eccgui}-graphviz__node__content`}>
                        {typeof content === "function" ? content(adjustedContentProps) : content}
                    </div>
                )}
                {contentExtension}
                {footerContent && <footer className={`${eccgui}-graphviz__node__footer`}>{footerContent}</footer>}
            </section>
            {!!handles && (
                <>
                    {addHandles(handleStack, Position.Top, "left", isConnectable, style, flowVersionCheck)}
                    {addHandles(handleStack, Position.Right, "top", isConnectable, style, flowVersionCheck)}
                    {addHandles(handleStack, Position.Bottom, "left", isConnectable, style, flowVersionCheck)}
                    {addHandles(handleStack, Position.Left, "top", isConnectable, style, flowVersionCheck)}
                </>
            )}
        </>
    );

    const validateWidth = (resizedWidth: number): number | undefined => {
        // only allow value if resize direction is allowed
        if (!resizeDirections.right) {
            return undefined;
        }
        // we need to check because there is probably a min value defined via CSS
        const min = parseFloat(getComputedStyle(nodeContentRef.current).getPropertyValue("min-width"));
        // we need to check for a given max value
        const max = resizeMaxDimensions?.width ?? Infinity;
        const validatedWidth = Math.max(Math.min(resizedWidth, max), min);
        return validatedWidth;
    };

    const validateHeight = (resizedHeight: number): number | undefined => {
        if (!resizeDirections.bottom) {
            return undefined;
        }
        // we need to check because there is probably a min value defined via CSS
        const min = parseFloat(getComputedStyle(nodeContentRef.current).getPropertyValue("min-height"));
        const max = resizeMaxDimensions?.height ?? Infinity;
        const validatedHeight = Math.max(Math.min(resizedHeight, max), min);
        return validatedHeight;
    };

    const resizableNode = () => {
        const size = { height: height ?? "auto", width: width ?? "auto" };
        return (
            <Resizable
                className={
                    `${eccgui}-graphviz__node__resizer` +
                    (resizeDirections.right ? ` ${eccgui}-graphviz__node__resizer--right` : "") +
                    (resizeDirections.bottom ? ` ${eccgui}-graphviz__node__resizer--bottom` : "")
                }
                handleWrapperClass={`${eccgui}-graphviz__node__resizer--cursorhandles` + " nodrag"}
                size={size}
                maxHeight={resizeMaxDimensions?.height ?? undefined}
                maxWidth={resizeMaxDimensions?.width ?? undefined}
                enable={resizeDirections.bottom && resizeDirections.right ? { bottomRight: true } : resizeDirections}
                scale={zoom}
                onResize={(_0, _1, _2, d) => {
                    if (nodeContentRef.current) {
                        const nextWidth = resizeDirections.right
                            ? (width ?? originalSize.current.width ?? 0) + d.width
                            : undefined;
                        const nextHeight = resizeDirections.bottom
                            ? (height ?? originalSize.current.height ?? 0) + d.height
                            : undefined;
                        if (nextWidth || nextHeight) {
                            const currentClassNames = nodeContentRef.current.classList;
                            currentClassNames.add("was-resized");
                        }
                        if (nextWidth) {
                            nodeContentRef.current.style.width = `${nextWidth}px`;
                        }
                        if (nextHeight) {
                            nodeContentRef.current.style.height = `${nextHeight}px`;
                        }
                    }
                }}
                onResizeStop={(_0, _1, _2, d) => {
                    const nextWidth = validateWidth((width ?? originalSize.current.width ?? 0) + d.width);
                    const nextHeight = validateHeight((height ?? originalSize.current.height ?? 0) + d.height);
                    setWidth(nextWidth);
                    setHeight(nextHeight);
                    if (onNodeResize) {
                        onNodeResize({
                            height: nextHeight,
                            width: nextWidth,
                        });
                    }
                }}
            >
                {nodeContent}
            </Resizable>
        );
    };

    return isResizable ? resizableNode() : nodeContent;
}

const evaluateHighlightColors = (
    baseCustomProperty: string,
    highlightColor?: NodeHighlightColor | NodeHighlightColor[]
) => {
    let styleHighlightColors = {
        [`${baseCustomProperty}-default-color`]: undefined,
        [`${baseCustomProperty}-alternate-color`]: undefined,
    } as React.CSSProperties;
    const classesHightlightColors = [] as string[];
    if (highlightColor) {
        const highlightingColors = typeof highlightColor === "string" ? [highlightColor] : highlightColor;
        (highlightingColors as Array<string>).map((color, idx) => {
            switch (color) {
                case "default":
                    classesHightlightColors.push("default");
                    break;
                case "alternate":
                    classesHightlightColors.push("alternate");
                    break;
                default: {
                    classesHightlightColors.push("custom");
                    let customColor = Color("#ffffff");
                    try {
                        customColor = Color(color);
                    } catch {
                        // eslint-disable-next-line no-console
                        console.warn("Received invalid color for highlight: " + color);
                    }
                    if (idx === 0) {
                        styleHighlightColors = {
                            ...styleHighlightColors,
                            [`${baseCustomProperty}-default-color`]: customColor.rgb().toString(),
                        } as React.CSSProperties;
                    } else {
                        styleHighlightColors = {
                            ...styleHighlightColors,
                            [`${baseCustomProperty}-alternate-color`]: customColor.rgb().toString(),
                        } as React.CSSProperties;
                    }
                    break;
                }
            }
            return color;
        });
    }

    return {
        highlightClassNameSuffix: classesHightlightColors,
        highlightCustomPropertySettings: styleHighlightColors,
    };
};

export const nodeContentUtils = {
    evaluateHighlightColors,
};
