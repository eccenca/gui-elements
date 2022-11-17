import React, { useState, useEffect, useCallback, FC } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ReactFlow, EdgeTools, NodeTools } from "./../../../index";
import { ReactFlowProps } from "./ReactFlow";
import { Elements, FlowElement } from "react-flow-renderer";

const nodeExamples = {
    unspecified: [
        {
            id: 'unspecified-1',
            type: "default",
            data: {
                label: "Default ", content: "Example content.", minimalShape: "none",
                menuButtons: <NodeTools>Pass your menu here.</NodeTools>
            },
            position: { x: 200, y: 50 },
        },
        {
            id: 'unspecified-2',
            type: "default",
            data: {
                label: "Default ", content: "Example content.", minimalShape: "none",
                handles: [ { type: "source", position: "left" }, { type: "target", position: "right" } ]
            },
            position: { x: 200, y: 300 },
        },
        {
            id: 'unspecified-e1', type: 'straight', label: "straight edge", arrowHeadType: "arrowclosed", source: 'unspecified-1', target: 'unspecified-2',
        },
        {
            id: 'unspecified-e2', type: 'step', label: "step edge", arrowHeadType: "arrowclosed", source: 'unspecified-2', target: 'unspecified-1',
        }
    ],
    linking: [
        {
            id: 'linking-1',
            type: "sourcepath",
            data: {
                label: "Source path", content: "Example content.", minimalShape: "none",
                menuButtons: <NodeTools>Pass your menu here.</NodeTools>
            },
            position: { x: 100, y: 50 },
        },
        {
            id: 'linking-2',
            type: "targetpath",
            data: {
                label: "Target path", content: "Example content.", minimalShape: "none"
            },
            position: { x: 400, y: 200 },
        },
        {
            id: 'linking-3',
            type: "transformation",
            data: {
                label: "Transformation", content: "Example content.", minimalShape: "none"
            },
            position: { x: 700, y: 50 },
        },
        {
            id: 'linking-4',
            type: "comparator",
            data: {
                label: "Comparation", content: "Example content.", minimalShape: "none",
                handles: [ { type: "source", position: "left" }, { type: "target", position: "right" } ]
            },
            position: { x: 750, y: 300 },
        },
        {
            id: 'linking-5',
            type: "aggregator",
            data: {
                label: "Aggregation", content: "Example content.", minimalShape: "none",
                handles: [ { type: "source", position: "left" }, { type: "target", position: "right" } ]
            },
            position: { x: 50, y: 300 },
        },
        { id: 'linking-e1', type: 'value', label: "value edge", arrowHeadType: "arrowclosed",source: 'linking-1', target: 'linking-2' },
        { id: 'linking-e2', type: 'score', label: "score edge", arrowHeadType: "arrowclosed",source: 'linking-2', target: 'linking-3' },
        { id: 'linking-e3', type: 'success', label: "success edge", arrowHeadType: "arrowclosed",source: 'linking-3', target: 'linking-4' },
        { id: 'linking-e4', type: 'warning', label: "warning edge", arrowHeadType: "arrowclosed",source: 'linking-4', target: 'linking-5' },
        { id: 'linking-e5', type: 'danger', label: "danger edge", arrowHeadType: "arrowclosed",source: 'linking-5', target: 'linking-1' },
    ],
    workflow: [
        {
            id: 'workflow-1',
            type: "dataset",
            data: {
                label: "Dataset", content: "Example content.", minimalShape: "none",
                menuButtons: <NodeTools>Pass your menu here.</NodeTools>
            },
            position: { x: 100, y: 50 },
        },
        {
            id: 'workflow-2',
            type: "linking",
            data: {
                label: "Linking", content: "Example content.", minimalShape: "none"
            },
            position: { x: 400, y: 200 },
        },
        {
            id: 'workflow-3',
            type: "transform",
            data: {
                label: "Transform", content: "Example content.", minimalShape: "none"
            },
            position: { x: 700, y: 50 },
        },
        {
            id: 'workflow-4',
            type: "task",
            data: {
                label: "Task", content: "Example content.", minimalShape: "none",
                handles: [ { type: "source", position: "left" }, { type: "target", position: "right" } ]
            },
            position: { x: 750, y: 300 },
        },
        {
            id: 'workflow-5',
            type: "workflow",
            data: {
                label: "Workflow", content: "Example content.", minimalShape: "none",
                handles: [ { type: "source", position: "left" }, { type: "target", position: "right" } ]
            },
            position: { x: 50, y: 300 },
        },
        { id: 'workflow-e1', arrowHeadType: "arrowclosed",source: 'workflow-1', target: 'workflow-2' },
        { id: 'workflow-e2', arrowHeadType: "arrowclosed",source: 'workflow-2', target: 'workflow-3' },
        { id: 'workflow-e3', type: 'success', label: "success edge", arrowHeadType: "arrowclosed",source: 'workflow-3', target: 'workflow-4' },
        { id: 'workflow-e4', type: 'warning', label: "warning edge", arrowHeadType: "arrowclosed",source: 'workflow-4', target: 'workflow-5' },
        { id: 'workflow-e5', type: 'danger', label: "danger edge", arrowHeadType: "arrowclosed",source: 'workflow-5', target: 'workflow-1' },
    ],
    graph: [
        {
            id: 'graph-1',
            type: "default",
            data: {
                label: "Default ", content: "Example content.", minimalShape: "none",
                menuButtons: <NodeTools>Pass your menu here.</NodeTools>
            },
            position: { x: 100, y: 50 },
        },
        {
            id: 'graph-2',
            type: "graph",
            data: {
                label: "Graph", content: "Example content.", minimalShape: "none"
            },
            position: { x: 400, y: 200 },
        },
        {
            id: 'graph-3',
            type: "class",
            data: {
                label: "Class", content: "Example content.", minimalShape: "none"
            },
            position: { x: 700, y: 50 },
        },
        {
            id: 'graph-4',
            type: "instance",
            data: {
                label: "Instance", content: "Example content.", minimalShape: "none",
                handles: [ { type: "source", position: "left" }, { type: "target", position: "right" } ]
            },
            position: { x: 750, y: 300 },
        },
        {
            id: 'graph-5',
            type: "property",
            data: {
                label: "Property", content: "Example content.", minimalShape: "none",
                handles: [ { type: "source", position: "left" }, { type: "target", position: "right" } ]
            },
            position: { x: 50, y: 300 },
        },
        { id: 'graph-e1', type: 'implicit', label: "implicit edge", arrowHeadType: "arrowclosed",source: 'graph-1', target: 'graph-2' },
        { id: 'graph-e2', type: 'import', label: "import edge", arrowHeadType: "arrowclosed",source: 'graph-2', target: 'graph-3' },
        { id: 'graph-e3', type: 'subclass', label: "subclass edge", arrowHeadType: "arrowclosed",source: 'graph-3', target: 'graph-4' },
        { id: 'graph-e4', type: 'subproperty', label: "subproperty edge", arrowHeadType: "arrowclosed",source: 'graph-4', target: 'graph-5' },
        { id: 'graph-e5', type: 'rdftype', label: "rdftype edge", arrowHeadType: "arrowclosed",source: 'graph-5', target: 'graph-1' },
    ],
}

export default {
    title: "CMEM/React Flow/Configurations",
    component: ReactFlow,
    argTypes: {
        configuration: {
            control: "select",
            options: Object.keys(nodeExamples),
        }
    },
} as ComponentMeta<typeof ReactFlow>;

const ReactFlowExample: FC<ReactFlowProps> = (args) => {
    const [reactflowInstance, setReactflowInstance] = useState(null);
    const [elements, setElements] = useState([] as Elements);
    const [edgeTools, setEdgeTools] = useState<JSX.Element>(<></>);

    useEffect(() => {
        setElements(nodeExamples[args.configuration ?? "unspecified"] as Elements);
    }, [args]);

    // Helper methods for nodes and edges
    const isNode = (element: FlowElement & { source?: string }): boolean =>
        !element.source;
    const isEdge = (element: FlowElement & { source?: string }): boolean =>
        !isNode(element);

    // Fired when clicked on any elements, e.g. edge or node. Used to show the edge menu.
    const onElementClick = React.useCallback((event, element) => {
        if (isEdge(element)) {
            event.preventDefault();
            setEdgeTools(
                <EdgeTools
                    posOffset={{ left: event.clientX, top: event.clientY }}
                    onClose={() => {
                        setEdgeTools(<></>);
                    }}
                >
                    EdgeTools demo,
                    add elements here.
                </EdgeTools>
            );
        }
    }, []);

    const onLoad = useCallback(
        (rfi) => {
            if (!reactflowInstance) {
                setReactflowInstance(rfi);
            }
        },
        [reactflowInstance]
    );

    return <>
        <ReactFlow
            configuration={args.configuration}
            elements={elements}
            style={{ height: '400px' }}
            onLoad={onLoad}
            defaultZoom={1}
            onElementClick={onElementClick}
            onEdgeContextMenu={onElementClick}
        />
        {edgeTools}
    </>
}

const Template: ComponentStory<typeof ReactFlow> = (args) => (
    <ReactFlowExample {...args} />
);

export const Default = Template.bind({});
Default.args = {
    configuration: "unspecified",
};
