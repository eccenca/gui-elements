import React, { useCallback, useMemo, useState } from "react";
import { Meta, StoryFn } from "@storybook/react";
import { Edge, Node, Position, ReactFlow } from "@xyflow/react";

import { NodeDefaultV12 } from "../../nodes/NodeDefaultV12";
import { EdgeDefaultV12, EdgeDefaultV12DataProps as EdgeData } from "../EdgeDefaultV12";

import { EdgeLabel, EdgeLabelObject } from "./../../../../../index";

/**
 * this is only a mock to get it as sub element in the table
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EdgeDefaultDataProps = (data: EdgeData) => {
    return <></>;
};

const edgeTypes = {
    default: EdgeDefaultV12,
};
const nodeTypes = {
    default: NodeDefaultV12,
};
export default {
    title: "Extensions/React Flow V12/Edge",
    component: EdgeDefaultV12,
    subcomponents: { EdgeDefaultDataProps },
} as Meta<typeof EdgeDefaultV12>;

const EdgeDefault = (args: Edge) => {
    const [reactflowInstance, setReactflowInstance] = useState(null);

    const [nodes, edges] = useMemo<[Node[], Edge[]]>(() => {
        return [
            [
                {
                    id: args.source,
                    type: "default",
                    data: {
                        label: "Default ",
                        content: "Example content.",
                        minimalShape: "none",
                    },
                    position: { x: 50, y: 0 },
                },
                {
                    id: args.target,
                    type: "default",
                    data: {
                        label: "Default ",
                        content: "Example content.",
                        minimalShape: "none",
                    },
                    position: { x: 300, y: 0 },
                },
            ] as Node[],
            [
                {
                    ...args,
                    sourceX: 150,
                    sourceY: 0,
                    targetX: 250,
                    targetY: 0,
                    sourcePosition: Position.Right,
                    targetPosition: Position.Left,
                },
            ],
        ];
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
        <div style={{ width: "1000px", height: "800px" }}>
            <ReactFlow
                defaultNodes={nodes}
                defaultEdges={edges}
                onLoad={onLoad}
                edgeTypes={edgeTypes}
                nodeTypes={nodeTypes}
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
