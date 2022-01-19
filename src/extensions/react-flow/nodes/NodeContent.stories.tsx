import React, { useState, useEffect, useCallback } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import ReactFlow, { Elements } from 'react-flow-renderer';

import { NodeContent } from "./NodeDefault";
import { nodeTypes } from "./nodeTypes";

export default {
    title: "Extensions/React Flow/Node Content",
    component: NodeContent,
    argTypes: {
        /*
        type: {
            control: "select",
            options: Object.keys(nodeTypes),
            mapping: Object.fromEntries(Object.keys(nodeTypes).map(type => [type, type])),
        }
        */
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
        style={{ height: '250px' }}
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
    label: 'Example node',
    minimalShape: "none",
};
