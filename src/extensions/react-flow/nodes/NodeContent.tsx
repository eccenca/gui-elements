import React from "react";
import { Position, useStoreState as getStoreStateFlowV9 } from "react-flow-renderer";
import { useStore as getStoreStateFlowV10 } from "react-flow-renderer-lts";
import Color from "color";
import { Resizable } from "re-resizable";

import { intentClassName, IntentTypes } from "../../../common/Intent";
import { DepictionProps } from "../../../components/Depiction/Depiction";
import { ValidIconName } from "../../../components/Icon/canonicalIconNames";
import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import { Depiction, Icon, OverflowText } from "../../../index";
import { ReacFlowVersionSupportProps, useReactFlowVersion } from "../versionsupport";

import { HandleDefault, HandleDefaultProps } from "./../handles/HandleDefault";
import { NodeContentExtensionProps } from "./NodeContentExtension";
import { NodeDefaultProps } from "./NodeDefault";
import { NodeHighlightColor } from "./sharedTypes";

/**
 * @deprecated (v26) use `HandleDefaultProps`
 */
export type NodeContentHandleProps = HandleDefaultProps;

type NodeDimensions = {
    width: number;
    height: number;
};

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

export interface NodeContentProps<CONTENT_PROPS = any>
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
        adjustedContentProps: Partial<CONTENT_PROPS>,
        setAdjustedContentProps: React.Dispatch<React.SetStateAction<Partial<CONTENT_PROPS>>>
    ) => React.ReactElement<React.HTMLAttributes<HTMLElement>>;
    /**
     * Can be used for permanent action button or context menu.
     * It is displayed at the node header right to the label.
     */
    menuButtons?: React.ReactNode;
    /**
     * Array of property definition objects for `Handle` components that need to be created for the node.
     * @see https://reactflow.dev/docs/api/handle/
     */
    handles?: HandleDefaultProps[];
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
    getMinimalTooltipData?: (node: NodeDefaultProps<CONTENT_PROPS>) => NodeContentData;
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

    /**
     * Additional data stored in the node.
     * @deprecated (v26) is not used anymore.
     */
    businessData?: never;

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
}

type MemoHandlerProps = HandleDefaultProps & {
    posdirection: string;
    style: {
        [key: string]: string | undefined;
    };
};

type HandleStack = { [key: string]: HandleDefaultProps[] };

const defaultHandles = (flowVersion: ReacFlowVersionSupportProps["flowVersion"]) => {
    switch (flowVersion) {
        case "v9":
        case "v10":
            return [{ type: "target" }, { type: "source" }] as HandleDefaultProps[];
        default:
            return [] as HandleDefaultProps[];
    }
};

const addHandles = (
    handles: HandleStack,
    position: MemoHandlerProps["position"],
    posDirection: MemoHandlerProps["posdirection"],
    isConnectable: MemoHandlerProps["isConnectable"],
    nodeStyle: MemoHandlerProps["style"],
    flowVersion: ReacFlowVersionSupportProps["flowVersion"] = "v9"
) => {
    return handles[position].map((handle: HandleDefaultProps, idx: number) => {
        const { style = {}, ...otherHandleProps } = handle;
        const styleAdditions: MemoHandlerProps["style"] = {
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
        return <MemoHandler flowVersion={flowVersion} {...handleProperties as MemoHandlerProps} key={"handle" + idx} />;
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
export function NodeContent<CONTENT_PROPS = React.HTMLAttributes<HTMLElement>>({
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
    style = {},
    showUnconnectableHandles = false,
    animated = false,
    introductionTime = 0,
    onNodeResize,
    nodeDimensions,
    // forwarded props
    targetPosition = Position.Left,
    sourcePosition = Position.Right,
    isConnectable = true,
    selected,
    letPassWheelEvents = false,
    // other props for DOM element
    ...otherDomProps
}: NodeContentProps<CONTENT_PROPS>) {
    const evaluateFlowVersion = useReactFlowVersion();
    const flowVersionCheck = flowVersion || evaluateFlowVersion;
    const [introductionDone, setIntroductionDone] = React.useState(false);

    // ignore some properties for now (remove them later)
    if (otherDomProps.businessData) { delete otherDomProps.businessData }
    if (otherDomProps.getMinimalTooltipData) { delete otherDomProps.getMinimalTooltipData }

    const { handles = defaultHandles(flowVersionCheck), ...otherProps } = otherDomProps;

    const isResizeable = !!onNodeResize && minimalShape === "none";
    const [width, setWidth] = React.useState<number>(nodeDimensions?.width ?? 0);
    const [height, setHeight] = React.useState<number>(nodeDimensions?.height ?? 0);
    let zoom = 1;
    if (isResizeable)
        try {
            [, , zoom] =
                flowVersionCheck === "v9"
                    ? getStoreStateFlowV9((state) => state.transform)
                    : getStoreStateFlowV10((state) => state.transform);
        } catch (error) {
            // do not handle error but at least push it to the console
            // eslint-disable-next-line no-console
            console.error(error);
        }
    const [adjustedContentProps, setAdjustedContentProps] = React.useState<Partial<CONTENT_PROPS>>({});
    const nodeContentRef = React.useRef<any>();
    const handleStack = ({} as HandleStack);
    handleStack[Position.Top] = ([] as HandleDefaultProps[]);
    handleStack[Position.Right] = ([] as HandleDefaultProps[]);
    handleStack[Position.Bottom] = ([] as HandleDefaultProps[]);
    handleStack[Position.Left] = ([] as HandleDefaultProps[]);

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

    // update node dimensions when resized
    React.useEffect(() => {
        if (nodeDimensions) {
            setWidth(nodeDimensions.width);
            setHeight(nodeDimensions.height);
        }
    }, [nodeDimensions]);

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
                let position: HandleDefaultProps["position"] = handle.position;

                // force position regarding special configuration
                if (handle.category === "configuration") {
                    position = Position.Top;
                } else {
                    if (handle.type === "target") {
                        position = targetPosition;
                    }
                    if (handle.type === "source") {
                        position = sourcePosition;
                    }
                }

                handle.position = position;
                handleStack[position].push(handle);
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
        !!onNodeResize === true && minimalShape === "none" && width + height > 0 ? { width, height } : {};

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
                    {addHandles(handleStack, Position.Top, "left", isConnectable, style as MemoHandlerProps["style"], flowVersionCheck)}
                    {addHandles(handleStack, Position.Right, "top", isConnectable, style as MemoHandlerProps["style"], flowVersionCheck)}
                    {addHandles(handleStack, Position.Bottom, "left", isConnectable, style as MemoHandlerProps["style"], flowVersionCheck)}
                    {addHandles(handleStack, Position.Left, "top", isConnectable, style as MemoHandlerProps["style"], flowVersionCheck)}
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
                if (onNodeResize) {
                    onNodeResize({
                        height: height + d.height,
                        width: width + d.width,
                    });
                }
            }}
        >
            {nodeContent}
        </Resizable>
    );

    return isResizeable ? resizableNode() : nodeContent;
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
                    } catch (ex) {
                        // eslint-disable-next-line no-console
                        console.warn("Received invalid color for highlight", {ex, color});
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
