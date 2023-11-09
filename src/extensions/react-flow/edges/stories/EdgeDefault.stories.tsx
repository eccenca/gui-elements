import React, { useCallback, useEffect, useState } from "react";
import { ArrowHeadType, Elements, getMarkerEnd, ReactFlowProvider } from "react-flow-renderer";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { EdgeLabel, EdgeLabelObject, ReactFlow } from "./../../../../../index";
import { EdgeDefault, EdgeDefaultDataProps as EdgeData } from "./../EdgeDefault";
import { edgeTypes } from "./../edgeTypes";

const EdgeDefaultDataProps = (data: EdgeData) => {
    // this is only a mock to get it as sub element in the table
    return <></>;
};

export default {
    title: "Extensions/React Flow/Edge",
    component: EdgeDefault,
    subcomponents: { EdgeDefaultDataProps },
    argTypes: {
        type: {
            control: "select",
            options: [...Object.keys(edgeTypes)],
        },
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
                    label: "Default ",
                    content: "Example content.",
                    minimalShape: "none",
                },
                position: { x: 50, y: 200 },
            },
            {
                id: args.target,
                type: "default",
                data: {
                    label: "Default ",
                    content: "Example content.",
                    minimalShape: "none",
                },
                position: { x: 600, y: 200 },
            },
            {
                ...args,
            },
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

    return (
        <ReactFlowProvider>
            <ReactFlow
                elements={elements}
                style={{ height: "400px" }}
                onLoad={onLoad}
                edgeTypes={edgeTypes}
                defaultZoom={1}
            />
        </ReactFlowProvider>
    );
};

const Template: ComponentStory<typeof EdgeDefault> = (args) => <EdgeDefaultExample {...args} />;

export const Default = Template.bind({});
Default.args = {
    id: "default",
    type: "dangerStep",
    label: "edge",
    arrowHeadType: "arrowclosed",
    source: "node-1",
    target: "node-2",
    data: {},
};

export const CustomLabel = Template.bind({});
CustomLabel.args = {
    ...Default.args,
    id: "customlabel",
    arrowHeadType: undefined,
    label: undefined,
    data: {
        renderLabel: (edgeCenter: [number, number, number, number]) => (
            <EdgeLabelObject edgeCenter={edgeCenter}>
                <EdgeLabel text="Custom label that is very long" />
            </EdgeLabelObject>
        ),
    },
};

export const InverseEdge = Template.bind({});
InverseEdge.args = {
    ...Default.args,
    id: "inverse",
    arrowHeadType: undefined,
    data: {
        inversePath: true,
        markerStart: getMarkerEnd(`${ArrowHeadType.ArrowClosed}-inverse` as ArrowHeadType),
    },
};

export const AdjustStrokeType = Template.bind({});
AdjustStrokeType.args = {
    ...Default.args,
    data: {
        strokeType: "double",
    },
};

export const AdjustIntent = Template.bind({});
AdjustIntent.args = {
    ...Default.args,
    data: {
        intent: "warning",
    },
};

export const AdjustHighlight = Template.bind({});
AdjustHighlight.args = {
    ...Default.args,
    data: {
        highlightColor: ["default", "alternate"],
    },
};
