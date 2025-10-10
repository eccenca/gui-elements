import React, { useCallback, useState } from "react";
import { Meta, StoryFn } from "@storybook/react";
import { addEdge, Edge, Node, OnConnect, Position, useEdgesState, useNodesState } from "@xyflow/react";

import {
    EdgeDefaultV12,
    EdgeDefaultV12DataProps as EdgeData,
    EdgeLabel,
    EdgeLabelObject,
    ReactFlowExtended,
    ReactFlowVersions,
} from "./../../../../../index";

/**
 * this is only a mock to get it as sub element in the table
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EdgeDefaultDataProps = (data: EdgeData) => {
    return <></>;
};

export default {
    title: "Extensions/React Flow V12/Edge",
    component: EdgeDefaultV12,
    subcomponents: { EdgeDefaultDataProps },
} as Meta<typeof EdgeDefaultV12>;

const EdgeDefault = (args: Edge) => {
    const [reactflowInstance, setReactflowInstance] = useState(null);

    const [nodes, , onNodesChange] = useNodesState([
        {
            id: args.source,
            type: "default",
            data: {
                label: "Default source",
                content: "Example content.",
                minimalShape: "none",
                handles: [
                    {
                        id: args.source,
                        type: "source",
                        tooltip: "this is a source handle",
                        position: Position.Right,
                        onClick: (params) => {
                            // eslint-disable-next-line no-console
                            console.log("onClick source", params);
                        },
                    },
                ],
            },
            position: { x: 50, y: 200 },
        },
        {
            id: args.target,
            type: "default",
            data: {
                label: "Default target",
                content: "Example content.",
                minimalShape: "none",
                handles: [
                    {
                        id: args.target,
                        type: "target",
                        tooltip: "this is a target handle",
                        position: Position.Left,
                        onClick: (params) => {
                            // eslint-disable-next-line no-console
                            console.log("onClick target", params);
                        },
                    },
                ],
            },
            position: { x: 600, y: 200 },
        },
    ] as Node[]);

    const [edges, setEdges, onEdgesChange] = useEdgesState([
        {
            ...args,
        },
    ]);

    const onConnect: OnConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

    const onLoad = useCallback(
        (rfi) => {
            if (!reactflowInstance) {
                setReactflowInstance(rfi);
            }
        },
        [reactflowInstance]
    );

    return (
        <div style={{ height: "400px" }}>
            <ReactFlowExtended
                flowVersion={ReactFlowVersions.V12}
                nodes={nodes}
                edges={edges}
                onLoad={onLoad}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
            />
        </div>
    );
};

const Template: StoryFn<typeof EdgeDefault> = (args) => <EdgeDefault {...args} />;

const defaultEdge: Edge = {
    id: "default",
    label: "edge",
    source: "node-1",
    target: "node-2",
    data: {
        edgeSvgProps: {
            className: "storybook__test__classname",
        },
    },
};

export const Default = Template.bind({});
Default.args = defaultEdge;

export const WithoutArrow = Template.bind({});
WithoutArrow.args = {
    ...Default.args,
    id: "noarrow",
    data: {
        markerAppearance: "none",
    },
};

export const CustomLabel = Template.bind({});
CustomLabel.args = {
    ...Default.args,
    id: "customlabel",
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
    data: {
        inversePath: true,
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
