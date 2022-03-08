import React, { useState, useEffect, useCallback } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ReactFlow } from "./ReactFlow";
import { Elements } from 'react-flow-renderer';

export default {
    title: "CMEM/React Flow/Configurations",
    component: ReactFlow,
    argTypes: {
    },
} as ComponentMeta<typeof NodeDefault>;

const nodeExamples = {
    unspecified: [
        {
            id: 1,
            type: "default",
            data: {
                label: "Default node", content: "Example content.", minimalShape: "none"
            },
            position: { x: 200, y: 50 },
        },
        {
            id: 2,
            type: "default",
            data: {
                label: "Default node", content: "Example content.", minimalShape: "none",
                handles: [ { type: "source", position: "left" }, { type: "target", position: "right" } ]
            },
            position: { x: 200, y: 300 },
        },
        {
            id: 'e1', type: 'straight', label: "straight edge", source: '1', target: '2',
        },
        {
            id: 'e2', type: 'step', label: "step edge", source: '2', target: '1',
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
            type: "transform",
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
        { id: 'e1', type: 'value', label: "value edge", source: '1', target: '2' },
        { id: 'e2', type: 'score', label: "score edge", source: '2', target: '3' },
        { id: 'e3', type: 'successStep', label: "success edge", source: '3', target: '4' },
        { id: 'e4', type: 'warningStep', label: "warning edge", source: '4', target: '5' },
        { id: 'e5', type: 'dangerStep', label: "danger edge", source: '5', target: '1' },
    ],
    workflow: [
        {
            id: 1,
            type: "datasetNode",
            data: {
                label: "Dataset", content: "Example content.", minimalShape: "none"
            },
            position: { x: 100, y: 50 },
        },
        {
            id: 2,
            type: "linkingNode",
            data: {
                label: "Linking", content: "Example content.", minimalShape: "none"
            },
            position: { x: 400, y: 200 },
        },
        {
            id: 3,
            type: "transformNode",
            data: {
                label: "Transform", content: "Example content.", minimalShape: "none"
            },
            position: { x: 700, y: 50 },
        },
        {
            id: 4,
            type: "taskNode",
            data: {
                label: "Task", content: "Example content.", minimalShape: "none",
                handles: [ { type: "source", position: "left" }, { type: "target", position: "right" } ]
            },
            position: { x: 750, y: 300 },
        },
        {
            id: 5,
            type: "workflowNode",
            data: {
                label: "Workflow", content: "Example content.", minimalShape: "none",
                handles: [ { type: "source", position: "left" }, { type: "target", position: "right" } ]
            },
            position: { x: 50, y: 300 },
        },
        { id: 'e1', source: '1', target: '2' },
        { id: 'e2', source: '2', target: '3' },
        { id: 'e3', type: 'successStep', label: "success edge", source: '3', target: '4' },
        { id: 'e4', type: 'warningStep', label: "warning edge", source: '4', target: '5' },
        { id: 'e5', type: 'dangerStep', label: "danger edge", source: '5', target: '1' },
    ],
    graph: [
        {
            id: 1,
            type: "default",
            data: {
                label: "Default node", content: "Example content.", minimalShape: "none"
            },
            position: { x: 100, y: 50 },
        },
        {
            id: 2,
            type: "graphNode",
            data: {
                label: "Graph", content: "Example content.", minimalShape: "none"
            },
            position: { x: 400, y: 200 },
        },
        {
            id: 3,
            type: "classNode",
            data: {
                label: "Class", content: "Example content.", minimalShape: "none"
            },
            position: { x: 700, y: 50 },
        },
        {
            id: 4,
            type: "instanceNode",
            data: {
                label: "Instance", content: "Example content.", minimalShape: "none",
                handles: [ { type: "source", position: "left" }, { type: "target", position: "right" } ]
            },
            position: { x: 750, y: 300 },
        },
        {
            id: 5,
            type: "propertyNode",
            data: {
                label: "Property", content: "Example content.", minimalShape: "none",
                handles: [ { type: "source", position: "left" }, { type: "target", position: "right" } ]
            },
            position: { x: 50, y: 300 },
        },
        { id: 'e1', type: 'implicitEdge', label: "implicit edge", source: '1', target: '2' },
        { id: 'e2', type: 'importEdge', label: "import edge", source: '2', target: '3' },
        { id: 'e3', type: 'subclassEdge', label: "subclass edge", source: '3', target: '4' },
        { id: 'e4', type: 'subpropertyEdge', label: "subproperty edge", source: '4', target: '5' },
        { id: 'e5', type: 'rdftypeEdge', label: "rdftype edge", source: '5', target: '1' },
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
