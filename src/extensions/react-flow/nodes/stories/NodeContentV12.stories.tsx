import React, {useCallback, useEffect, useState} from "react";
import {Node, Position, ReactFlow, ReactFlowProvider} from "@xyflow/react";
import {LoremIpsum, loremIpsum} from "react-lorem-ipsum";
import {Meta, StoryFn} from "@storybook/react";

import {Definitions} from "../../../../common/Intent";

import canonicalIcons from "./../../../../components/Icon/canonicalIconNames";
import {
    Badge,
    ContextMenu,
    HtmlContentBlock,
    IconButton,
    MenuItem,
    NodeContent,
    NodeContentExtension,
    OverflowText,
    Tag,
    TagList,
} from "./../../../../index";
import {
    Default as ContentExtensionExample,
    SlideOutOfNode as ContentExtensionExampleSlideOut,
} from "./NodeContentExtension.stories";
import {NodeDefaultV12} from "../NodeDefaultV12";

export default {
    title: "Extensions/React Flow V12/Node Content",
    component: NodeContent,
    subcomponents: { NodeContentExtension },
    argTypes: {
        contentExtension: {
            control: "select",
            options: ["Not set", "Default example", "Slide out example"],
            mapping: {
                "Not set": undefined,
                "Default example": <NodeContentExtension {...ContentExtensionExample.args} />,
                "Slide out example": <NodeContentExtension {...ContentExtensionExampleSlideOut.args} />,
            },
        },
        labelSubline: {
            control: "select",
            options: ["Not set", "Text string", "OverflowText element", "Tag list"],
            mapping: {
                "Not set": undefined,
                "Text string": loremIpsum({
                    p: 1,
                    avgSentencesPerParagraph: 1,
                    avgWordsPerSentence: 8,
                    random: false,
                }).toString(),
                "OverflowText element": (
                    <OverflowText>
                        {loremIpsum({
                            p: 1,
                            avgSentencesPerParagraph: 2,
                            avgWordsPerSentence: 4,
                            random: false,
                        }).toString()}
                    </OverflowText>
                ),
                "Tag list": (
                    <TagList>
                        {loremIpsum({ p: 1, avgSentencesPerParagraph: 1, avgWordsPerSentence: 5, random: false })
                            .toString()
                            .split(" ")
                            .map((term) => (
                                <Tag small>{term}</Tag>
                            ))}
                    </TagList>
                ),
            },
        },
        menuButtons: {
            control: "select",
            options: ["Not set", "Icon button", "Context Menu", "Info badge"],
            mapping: {
                "Not set": undefined,
                "Icon button": <IconButton name="item-info" text="Icon button" onClick={() => alert("Click info")} />,
                "Context Menu": (
                    <ContextMenu>
                        <MenuItem text="Context menu" />
                    </ContextMenu>
                ),
                "Info badge": <Badge intent="info">Info</Badge>,
            },
        },
        iconName: {
            control: "select",
            options: [...Object.keys(canonicalIcons)],
        },
        highlightedState: {
            control: "select",
            options: ["Not set", "success", "warning", "danger", "match", "altmatch", "danger + match"],
            mapping: {
                "Not set": undefined,
                "danger + match": ["danger", "match"],
            },
        },
        border: {
            control: "select",
            options: [undefined, "solid", "double", "dashed", "dotted"],
        },
        intent: {
            control: "select",
            options: [ undefined, ...Object.values(Definitions) ],
        },
        highlightColor: {
            control: "select",
            options: [ "Not set", "Default", "Alternate", "Default + alternate", "Custom (red)", "Default + Custom (red)", "Custom (green) + alternate", "Custom (purple) + custom (yellow)"],
            mapping: {
                "Not set": undefined,
                Default: "default",
                Alternate: "alternate",
                "Default + alternate": ["default", "alternate"],
                "Custom (red)": "red",
                "Default + Custom (red)": ["default", "red"],
                "Custom (green) + alternate": ["green", "alternate"],
                "Custom (purple) + custom (yellow)": ["purple", "yellow"],
            },
        },
        content: { control: false },
        footerContent: { control: false },
        isConnectable: { table: { disable: true } },
        targetPosition: { table: { disable: true } },
        sourcePosition: { table: { disable: true } },
        selected: { table: { disable: true } },
        businessData: { table: { disable: true } },
    },
} as Meta<typeof NodeContent>;

let forcedUpdateKey = 0; // @see https://github.com/storybookjs/storybook/issues/13375#issuecomment-1291011856



const nodeTypes = {default: NodeDefaultV12};

const NodeContentExample = (args: any) => {
    const [reactflowInstance, setReactflowInstance] = useState(null);
    const [elements, setElements] = useState([] as Node[]);

    const defaultElement ={
        id: "example-1",
        type: "default",
        data: args as object & {label:string},
        position: { x: 50, y: 50 },
    };

    useEffect(() => {
        const sizeReset = {}
        if (args.resizeMaxDimensions && args.resizeDirections) {
            sizeReset["onNodeResize"] = (dimensions) => {
                // eslint-disable-next-line no-console
                console.log("call onNodeResize method")
                if (args.onNodeResize) {
                    args.onNodeResize(dimensions);
                }
                if (dimensions?.width || dimensions?.height) {
                    sizeReset["menuButtons"] = <IconButton name="item-reset" onClick={() => {
                        // eslint-disable-next-line no-console
                        console.log("reset size");
                        setElements([
                            {
                                ...defaultElement,
                                data: {...defaultElement.data, ...sizeReset, ...{ nodeDimensions: {} }},
                            },
                        ] as Node[]);

                    }}/>;
                }
                setElements([
                    {
                        ...defaultElement,
                        data: {...defaultElement.data, ...sizeReset, ...{ nodeDimensions: dimensions }},
                    },
                ] as Node[]);
            }
        }
        setElements([
            {
                ...defaultElement,
                data: {...defaultElement.data, ...sizeReset},
            },
        ] as Node[]);
    }, [args]);

    const onLoad = useCallback(
        (rfi) => {
            if (!reactflowInstance) {
                setReactflowInstance(rfi);
            }
        },
        [reactflowInstance]
    );

    return (
        <div style={{ width: "100%", height: "400px" }}>
        <ReactFlowProvider>
            <ReactFlow
                nodes={elements}
                edges={[]}
                style={{ height: "400px" }}
                onLoad={onLoad}
                nodeTypes={nodeTypes}
            />
        </ReactFlowProvider>
        </div>
    );
};

const Template: StoryFn<typeof NodeContent> = (args) => <NodeContentExample {...args} /*some comment*/  key={++forcedUpdateKey} />;

export const Default = Template.bind({});
Default.args = {
    label: "Node title",
    content: (
        <HtmlContentBlock>
            <h4>Node body</h4>
            <LoremIpsum p={4} avgSentencesPerParagraph={3} random={false} />
        </HtmlContentBlock>
    ),
    footerContent: <OverflowText passDown>Node footer with some text information.</OverflowText>,
    contentExtension: undefined,
    minimalShape: "none",
    getMinimalTooltipData: (node: any) => {
        return {
            label: node.data?.label,
            content: node.data?.content,
            iconName: node.data?.iconName,
            depiction: node.data?.depiction,
        };
    },
    handles: [
        {
            type: "target",
            tooltip: "this is a target handle",
            position: Position.Left,
        },
        {
            type: "source",
            position: Position.Bottom,
            data: { extendedTooltip: "this is a source handle" },
        },
    ],
};

export const Resizeable = Template.bind({});
Resizeable.args = {
    ...Default.args,
    resizeMaxDimensions: { width: 1000, height: 500 },
    nodeDimensions: {},
    resizeDirections: { bottom: true, right: true },
    onNodeResize: (dimensions) => {
        // eslint-disable-next-line no-console
        console.log("onNodeResize", `new dimensions: ${dimensions.width}x${dimensions.height}`);
    },
};
