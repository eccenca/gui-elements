import React, { useState, useEffect, useCallback } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ReactFlow } from "./ReactFlow";
import { Elements } from 'react-flow-renderer';

export default {
    title: "CMEM/React Flow/Configurations",
    component: ReactFlow,
    argTypes: {
    },
} as ComponentMeta<typeof ReactFlow>;

const nodeExamples = {
    unspecified: [
        {
            id: 1,
            type: "default",
            data: {
                label: "Default ", content: "Example content.", minimalShape: "none"
            },
            position: { x: 200, y: 50 },
        },
        {
            id: 2,
            type: "default",
            data: {
                label: "Default ", content: "Example content.", minimalShape: "none",
                handles: [ { type: "source", position: "left" }, { type: "target", position: "right" } ]
            },
            position: { x: 200, y: 300 },
        },
        {
            id: 'e1', type: 'straight', label: "straight edge", arrowHeadType: "arrowclosed",source: '1', target: '2',
        },
        {
            id: 'e2', type: 'step', label: "step edge", arrowHeadType: "arrowclosed",source: '2', target: '1',
        }
    ],
    linking: [
        {
            id: 1,
            type: "sourcepath",
            data: {
                label: "Source path", content: "Example content.", minimalShape: "none"
            },
            position: { x: 100, y: 50 },
        },
        {
            id: 2,
            type: "targetpath",
            data: {
                label: "Target path", content: "Example content.", minimalShape: "none"
            },
            position: { x: 400, y: 200 },
        },
        {
            id: 3,
            type: "transformation",
            data: {
                label: "Transformation", content: "Example content.", minimalShape: "none"
            },
            position: { x: 700, y: 50 },
        },
        {
            id: 4,
            type: "comparator",
            data: {
                label: "Comparation", content: "Example content.", minimalShape: "none",
                handles: [ { type: "source", position: "left" }, { type: "target", position: "right" } ]
            },
            position: { x: 750, y: 300 },
        },
        {
            id: 5,
            type: "aggregator",
            data: {
                label: "Aggregation", content: "Example content.", minimalShape: "none",
                handles: [ { type: "source", position: "left" }, { type: "target", position: "right" } ]
            },
            position: { x: 50, y: 300 },
        },
        { id: 'e1', type: 'value', label: "value edge", arrowHeadType: "arrowclosed",source: '1', target: '2' },
        { id: 'e2', type: 'score', label: "score edge", arrowHeadType: "arrowclosed",source: '2', target: '3' },
        { id: 'e3', type: 'success', label: "success edge", arrowHeadType: "arrowclosed",source: '3', target: '4' },
        { id: 'e4', type: 'warning', label: "warning edge", arrowHeadType: "arrowclosed",source: '4', target: '5' },
        { id: 'e5', type: 'danger', label: "danger edge", arrowHeadType: "arrowclosed",source: '5', target: '1' },
    ],
    workflow: [
        {
            id: 1,
            type: "dataset",
            data: {
                label: "Dataset", content: "Example content.", minimalShape: "none"
            },
            position: { x: 100, y: 50 },
        },
        {
            id: 2,
            type: "linking",
            data: {
                label: "Linking", content: "Example content.", minimalShape: "none"
            },
            position: { x: 400, y: 200 },
        },
        {
            id: 3,
            type: "transform",
            data: {
                label: "Transform", content: "Example content.", minimalShape: "none"
            },
            position: { x: 700, y: 50 },
        },
        {
            id: 4,
            type: "task",
            data: {
                label: "Task", content: "Example content.", minimalShape: "none",
                handles: [ { type: "source", position: "left" }, { type: "target", position: "right" } ]
            },
            position: { x: 750, y: 300 },
        },
        {
            id: 5,
            type: "workflow",
            data: {
                label: "Workflow", content: "Example content.", minimalShape: "none",
                handles: [ { type: "source", position: "left" }, { type: "target", position: "right" } ]
            },
            position: { x: 50, y: 300 },
        },
        { id: 'e1', arrowHeadType: "arrowclosed",source: '1', target: '2' },
        { id: 'e2', arrowHeadType: "arrowclosed",source: '2', target: '3' },
        { id: 'e3', type: 'success', label: "success edge", arrowHeadType: "arrowclosed",source: '3', target: '4' },
        { id: 'e4', type: 'warning', label: "warning edge", arrowHeadType: "arrowclosed",source: '4', target: '5' },
        { id: 'e5', type: 'danger', label: "danger edge", arrowHeadType: "arrowclosed",source: '5', target: '1' },
    ],
    graph: [
        {
            id: 1,
            type: "default",
            data: {
                label: "Default ", content: "Example content.", minimalShape: "none"
            },
            position: { x: 100, y: 50 },
        },
        {
            id: 2,
            type: "graph",
            data: {
                label: "Graph", content: "Example content.", minimalShape: "none"
            },
            position: { x: 400, y: 200 },
        },
        {
            id: 3,
            type: "class",
            data: {
                label: "Class", content: "Example content.", minimalShape: "none"
            },
            position: { x: 700, y: 50 },
        },
        {
            id: 4,
            type: "instance",
            data: {
                label: "Instance", content: "Example content.", minimalShape: "none",
                handles: [ { type: "source", position: "left" }, { type: "target", position: "right" } ]
            },
            position: { x: 750, y: 300 },
        },
        {
            id: 5,
            type: "property",
            data: {
                label: "Property", content: "Example content.", minimalShape: "none",
                handles: [ { type: "source", position: "left" }, { type: "target", position: "right" } ]
            },
            position: { x: 50, y: 300 },
        },
        { id: 'e1', type: 'implicit', label: "implicit edge", arrowHeadType: "arrowclosed",source: '1', target: '2' },
        { id: 'e2', type: 'import', label: "import edge", arrowHeadType: "arrowclosed",source: '2', target: '3' },
        { id: 'e3', type: 'subclass', label: "subclass edge", arrowHeadType: "arrowclosed",source: '3', target: '4' },
        { id: 'e4', type: 'subproperty', label: "subproperty edge", arrowHeadType: "arrowclosed",source: '4', target: '5' },
        { id: 'e5', type: 'rdftype', label: "rdftype edge", arrowHeadType: "arrowclosed",source: '5', target: '1' },
    ],
}

const ReactFlowExample = (args) => {
    const [reactflowInstance, setReactflowInstance] = useState(null);
    const [elements, setElements] = useState([] as Elements);
    //const [edgeTools, setEdgeTools] = useState<JSX.Element>(<></>);

    useEffect(() => {
        setElements(nodeExamples[args.configuration] as Elements);
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
        configuration={args.configuration}
        elements={elements}
        style={{ height: '400px' }}
        onLoad={onLoad}
        defaultZoom={1}
    />
}

const Template: ComponentStory<typeof ReactFlow> = (args) => (
    <ReactFlowExample {...args} />
);

export const Default = Template.bind({});
Default.args = {
    configuration: "unspecified",
};
