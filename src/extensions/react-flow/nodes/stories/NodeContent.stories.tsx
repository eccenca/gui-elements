import React, { useState, useEffect, useCallback } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { LoremIpsum } from 'react-lorem-ipsum';
import ReactFlow, { Elements, ReactFlowProvider } from 'react-flow-renderer';
import {
    OverflowText,
    HtmlContentBlock,
} from "./../../../../index";

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
    onNodeResize: (dimensions) => { alert(`new dimensions: ${dimensions.width}x${dimensions.height}`); },
}
