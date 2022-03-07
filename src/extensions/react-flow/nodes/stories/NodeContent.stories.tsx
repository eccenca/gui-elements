import React, { useState, useEffect, useCallback } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { LoremIpsum } from 'react-lorem-ipsum';
import ReactFlow, { Elements } from 'react-flow-renderer';
import HtmlContentBlock from "../../../../components/Typography/HtmlContentBlock";

import { NodeContent } from "./../NodeDefault";
import { nodeTypes } from "./../nodeTypes";
import { NodeContentExtension } from "./../NodeContentExtension";
import { Default as ContentExtensionExample } from "./NodeContentExtension.stories";

export default {
    title: "Extensions/React Flow/Node Content",
    component: NodeContent,
    subcomponents: { NodeContentExtension },
    argTypes: {
        contentExtension: {
            control: "select",
            options: ["Not set", "Default example"],
            mapping: {
                "Not set": undefined,
                "Default example": <ContentExtensionExample />,
            },
        },
        content: { control: "none" },
        isConnectable: { table: { disable: true } },
        targetPosition: { table: { disable: true } },
        sourcePosition: { table: { disable: true } },
        selected: { table: { disable: true } },
        businessData: { table: { disable: true } },
    },
} as ComponentMeta<typeof NodeContent>;

const NodeContentExample = (args) => {
    const [reactflowInstance, setReactflowInstance] = useState(null);
    const [elements, setElements] = useState([] as Elements);
    //const [edgeTools, setEdgeTools] = useState<JSX.Element>(<></>);

    useEffect(() => {
        setElements([
            {
                id: '1',
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

    return <ReactFlow
        elements={elements}
        style={{ height: '400px' }}
        onLoad={onLoad}
        nodeTypes={ nodeTypes }
        defaultZoom={1}
    />
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
    contentExtension: <ContentExtensionExample />,
    minimalShape: "none",
};
