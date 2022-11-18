import React, { useState, useEffect, useCallback } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ReactFlow, Tag } from "./../../../../../index";
import { ArrowHeadType, Elements, getMarkerEnd, ReactFlowProvider } from 'react-flow-renderer';

import { EdgeDefault, EdgeDefaultDataProps as EdgeData } from "./../EdgeDefault";
import { edgeTypes } from "./../edgeTypes";

const EdgeDefaultDataProps = (data: EdgeData) => {
    // this is only a mock to get it as sub element in the table
    return <></>;
}

export default {
    title: "Extensions/React Flow/Default Edge",
    component: EdgeDefault,
    subcomponents: { EdgeDefaultDataProps },
    argTypes: {
    },
} as ComponentMeta<typeof EdgeDefault>;

const EdgeDefaultExample = (args: any) => {
    const [reactflowInstance, setReactflowInstance] = useState(null);
    const [elements, setElements] = useState([] as Elements);

    useEffect(() => {
        setElements([
            {
                id: args.source,
                type: "default",
                data: {
                    label: "Default ", content: "Example content.", minimalShape: "none",
                },
                position: { x: 50, y: 200 },
            },
            {
                id: args.target,
                type: "default",
                data: {
                    label: "Default ", content: "Example content.", minimalShape: "none",
                },
                position: { x: 600, y: 200 },
            },
            {
                ...args
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

    return <ReactFlowProvider>
        <ReactFlow
            elements={elements}
            style={{ height: '400px' }}
            onLoad={onLoad}
            edgeTypes={ edgeTypes }
            defaultZoom={1}
        />
    </ReactFlowProvider>
}

const Template: ComponentStory<typeof EdgeDefault> = (args) => (
    <EdgeDefaultExample {...args} />
);

export const Default = Template.bind({});
Default.args = {
    id: 'default',
    type: 'default',
    label: "edge",
    arrowHeadType: "arrowclosed",
    source: 'node-1',
    target: 'node-2',
    data: {
    }
};

export const CustomLabel = Template.bind({});
CustomLabel.args = {
    ...Default.args,
    id: "customlabel",
    arrowHeadType: undefined,
    data: {
        renderLabel: (
            edgeCenter: [number, number, number, number]
        ) => (
            <foreignObject
                width={100}
                height={20}
                x={edgeCenter[0] - 50}
                y={edgeCenter[1] - 10}
                requiredExtensions="http://www.w3.org/1999/xhtml"
            >
                <body>
                    <Tag>Custom label</Tag>
                </body>
            </foreignObject>
        )
    }
};

export const InverseEdge = Template.bind({});
InverseEdge.args = {
    ...Default.args,
    id: "inverse",
    arrowHeadType: undefined,
    data: {
        inversePath: true,
        markerStart: getMarkerEnd(
            `${ArrowHeadType.ArrowClosed}-inverse` as ArrowHeadType
        ),
    }
};
