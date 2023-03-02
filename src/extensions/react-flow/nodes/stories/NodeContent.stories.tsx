import React, { useState, useEffect, useCallback } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { LoremIpsum, loremIpsum } from 'react-lorem-ipsum';
import ReactFlow, { Elements, ReactFlowProvider } from 'react-flow-renderer';
import {
    Badge,
    ContextMenu,
    MenuItem,
    OverflowText,
    HtmlContentBlock,
    IconButton,
    Tag,
    TagList,
} from "./../../../../index";
import canonicalIcons from "./../../../../components/Icon/canonicalIconNames";
import { Definitions } from "../../../../common/Intent";

import { NodeContent } from "./../NodeContent";
import { nodeTypes } from "./../nodeTypes";
import { NodeContentExtension } from "./../NodeContentExtension";
import {
    Default as ContentExtensionExample,
    SlideOutOfNode as ContentExtensionExampleSlideOut,
} from "./NodeContentExtension.stories";

export default {
    title: "Extensions/React Flow/Node Content",
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
                "Text string": loremIpsum({ p: 1, avgSentencesPerParagraph: 1, avgWordsPerSentence: 8, random: false }).toString(),
                "OverflowText element": <OverflowText>{loremIpsum({ p: 1, avgSentencesPerParagraph: 2, avgWordsPerSentence: 4, random: false }).toString()}</OverflowText>,
                "Tag list": <TagList>{
                    loremIpsum({ p: 1, avgSentencesPerParagraph: 1, avgWordsPerSentence: 5, random: false })
                    .toString()
                    .split(" ")
                    .map((term) => <Tag small>{term}</Tag>)
                }</TagList>
            },
        },
        menuButtons: {
            control: "select",
            options: ["Not set", "Icon button", "Context Menu", "Info badge"],
            mapping: {
                "Not set": undefined,
                "Icon button": <IconButton name="item-info" text="Icon button" onClick={()=>alert("Click info")} />,
                "Context Menu": <ContextMenu><MenuItem text="Context menu" /></ContextMenu>,
                "Info badge": <Badge intent="info">Info</Badge>,
            },
        },
        iconName: {
            control: "select",
            options: [...(Object.keys(canonicalIcons))],
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
            options: {"Not set": undefined, ...Definitions},
        },
        highlightColor: {
            control: "select",
            options: {
                "Not set": undefined,
                "Default": "default",
                "Alternate": "alternate",
                "Default + alternate": ["default" , "alternate"],
                "Custom (red)": "red",
                "Default + Custom (red)": ["default", "red"],
                "Custom (green) + alternate": ["green", "alternate"],
                "Custom (purple) + custom (yellow)": ["purple", "yellow"],
            }
        },
        content: { control: "none" },
        footerContent: { control: "none" },
        isConnectable: { table: { disable: true } },
        targetPosition: { table: { disable: true } },
        sourcePosition: { table: { disable: true } },
        selected: { table: { disable: true } },
        businessData: { table: { disable: true } },
    },
} as ComponentMeta<typeof NodeContent>;

const NodeContentExample = (args: any) => {
    const [reactflowInstance, setReactflowInstance] = useState(null);
    const [elements, setElements] = useState([] as Elements);
    //const [edgeTools, setEdgeTools] = useState<JSX.Element>(<></>);

    useEffect(() => {
        setElements([
            {
                id: 'example-1',
                type: 'default',
                data: args,
                position: { x: 50, y: 50 },
            }
        ] as Elements);
    }, [args]);

    const onLoad = useCallback(
        (rfi) => {
            if (!reactflowInstance) {
                setReactflowInstance(rfi);
            }
        },
        [reactflowInstance]
    );

    return <ReactFlowProvider><ReactFlow
        elements={elements}
        style={{ height: '400px' }}
        onLoad={onLoad}
        nodeTypes={ nodeTypes }
        defaultZoom={1}
    /></ReactFlowProvider>
}

const Template: ComponentStory<typeof NodeContent> = (args) => (
    <NodeContentExample {...args} /*some comment*/ />
);

export const Default = Template.bind({});
Default.args = {
    label: 'Node title',
    content: (
        <HtmlContentBlock>
            <h4>Node body</h4>
            <LoremIpsum p={4} avgSentencesPerParagraph={3} random={false} />
        </HtmlContentBlock>
    ),
    footerContent: (
        <OverflowText passDown>
            Node footer with some text information.
        </OverflowText>
    ),
    contentExtension: undefined,
    minimalShape: "none",
    getMinimalTooltipData: (node: any) => {
        return {
            label: node.data?.label,
            content: node.data?.content,
            iconName: node.data?.iconName,
            depiction: node.data?.depiction,
        }
    },
    handles: [
        {
            type: "target",
            tooltip: "this is a target handle",
        },
        {
            type: "source",
            data: {extendedTooltip: "this is a source handle"}
        }
    ],
    onNodeResize: false, // workaround that storybook do not automatically include empty handle function
};

export const Resizeable = Template.bind({});
Resizeable.args = {
    ...Default.args,
    onNodeResize: (dimensions) => { console.log('onNodeResize', `new dimensions: ${dimensions.width}x${dimensions.height}`); },
}
