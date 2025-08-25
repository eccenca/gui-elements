import React, { FC, useCallback, useEffect, useState } from "react";
import {
    Background as BackgroundV9,
    BackgroundVariant as BackgroundVariantV9,
    Elements,
    FlowElement,
    Position,
} from "react-flow-renderer";
import { Meta, StoryFn } from "@storybook/react";
import { fn } from "@storybook/test";
import {
    Background as BackgroundV12,
    BackgroundVariant as BackgroundVariantV12,
    Edge as Edge12,
    Node as Node12,
    useEdgesState as useEdgesState12,
    useNodesState as useNodesState12,
} from "@xyflow/react";

import {
    ApplicationContainer,
    EdgeTools,
    MiniMap,
    MiniMapV12,
    NodeTools,
    ReactFlowExtended,
    ReactFlowExtendedProps,
} from "./../../../index";

const nodeExamples = {
    unspecified: {
        nodes: [
            {
                id: "unspecified-1",
                type: "default",
                data: {
                    label: "Default ",
                    content: "Example content.",
                    minimalShape: "none",
                    menuButtons: <NodeTools>Pass your menu here.</NodeTools>,
                },
                position: { x: 200, y: 50 },
            },
            {
                id: "unspecified-2",
                type: "default",
                targetPosition: Position.Right,
                sourcePosition: Position.Left,
                data: {
                    label: "Default ",
                    content: "Example content.",
                    minimalShape: "none",
                    handles: [
                        { type: "source", position: "left" },
                        { type: "target", position: "right" },
                    ],
                },
                position: { x: 200, y: 300 },
            },
        ],
        edges: [
            {
                id: "unspecified-e1",
                type: "straight",
                label: "straight edge",
                arrowHeadType: "arrowclosed",
                source: "unspecified-1",
                target: "unspecified-2",
            },
            {
                id: "unspecified-e2",
                type: "step",
                label: "step edge",
                arrowHeadType: "arrowclosed",
                source: "unspecified-2",
                target: "unspecified-1",
            },
        ],
    },
    linking: {
        nodes: [
            {
                id: "linking-1",
                type: "sourcepath",
                data: {
                    label: "Source path",
                    content: "Example content.",
                    minimalShape: "none",
                    menuButtons: <NodeTools>Pass your menu here.</NodeTools>,
                },
                position: { x: 100, y: 50 },
            },
            {
                id: "linking-2",
                type: "targetpath",
                data: {
                    label: "Target path",
                    content: "Example content.",
                    minimalShape: "none",
                },
                position: { x: 400, y: 200 },
            },
            {
                id: "linking-3",
                type: "transformation",
                data: {
                    label: "Transformation",
                    content: "Example content.",
                    minimalShape: "none",
                },
                position: { x: 700, y: 50 },
            },
            {
                id: "linking-4",
                type: "comparator",
                targetPosition: Position.Right,
                sourcePosition: Position.Left,
                data: {
                    label: "Comparation",
                    content: "Example content.",
                    minimalShape: "none",
                    handles: [
                        { type: "source", position: "left" },
                        { type: "target", position: "right" },
                    ],
                },
                position: { x: 750, y: 300 },
            },
            {
                id: "linking-5",
                type: "aggregator",
                targetPosition: Position.Right,
                sourcePosition: Position.Left,
                data: {
                    label: "Aggregation",
                    content: "Example content.",
                    minimalShape: "none",
                    handles: [
                        { type: "source", position: "left" },
                        { type: "target", position: "right" },
                    ],
                },
                position: { x: 50, y: 300 },
            },
        ],
        edges: [
            {
                id: "linking-e1",
                type: "value",
                label: "value edge",
                arrowHeadType: "arrowclosed",
                source: "linking-1",
                target: "linking-2",
            },
            {
                id: "linking-e2",
                type: "score",
                label: "score edge",
                arrowHeadType: "arrowclosed",
                source: "linking-2",
                target: "linking-3",
            },
            {
                id: "linking-e3",
                type: "success",
                label: "success edge",
                arrowHeadType: "arrowclosed",
                source: "linking-3",
                target: "linking-4",
            },
            {
                id: "linking-e4",
                type: "warning",
                label: "warning edge",
                arrowHeadType: "arrowclosed",
                source: "linking-4",
                target: "linking-5",
            },
            {
                id: "linking-e5",
                type: "danger",
                label: "danger edge",
                arrowHeadType: "arrowclosed",
                source: "linking-5",
                target: "linking-1",
            },
        ],
    },
    workflow: {
        nodes: [
            {
                id: "workflow-1",
                type: "dataset",
                data: {
                    label: "Dataset",
                    content: "Example content.",
                    minimalShape: "none",
                    menuButtons: <NodeTools>Pass your menu here.</NodeTools>,
                },
                position: { x: 100, y: 50 },
            },
            {
                id: "workflow-2",
                type: "linking",
                data: {
                    label: "Linking",
                    content: "Example content.",
                    minimalShape: "none",
                },
                position: { x: 400, y: 200 },
            },
            {
                id: "workflow-3",
                type: "transform",
                data: {
                    label: "Transform",
                    content: "Example content.",
                    minimalShape: "none",
                },
                position: { x: 700, y: 50 },
            },
            {
                id: "workflow-4",
                type: "task",
                targetPosition: Position.Right,
                sourcePosition: Position.Left,
                data: {
                    label: "Task",
                    content: "Example content.",
                    minimalShape: "none",
                    handles: [
                        { type: "source", position: "left" },
                        { type: "target", position: "right" },
                    ],
                },
                position: { x: 750, y: 300 },
            },
            {
                id: "workflow-5",
                type: "workflow",
                targetPosition: Position.Right,
                sourcePosition: Position.Left,
                data: {
                    label: "Workflow",
                    content: "Example content.",
                    minimalShape: "none",
                    handles: [
                        { type: "source", position: "left" },
                        { type: "target", position: "right" },
                    ],
                },
                position: { x: 50, y: 300 },
            },
        ],
        edges: [
            {
                id: "workflow-e1",
                label: "default",
                arrowHeadType: "arrowclosed",
                source: "workflow-1",
                target: "workflow-2",
            },
            {
                id: "workflow-e2",
                label: "default",
                arrowHeadType: "arrowclosed",
                source: "workflow-2",
                target: "workflow-3",
            },
            {
                id: "workflow-e3",
                type: "success",
                label: "success edge",
                arrowHeadType: "arrowclosed",
                source: "workflow-3",
                target: "workflow-4",
            },
            {
                id: "workflow-e4",
                type: "warning",
                label: "warning edge",
                arrowHeadType: "arrowclosed",
                source: "workflow-4",
                target: "workflow-5",
            },
            {
                id: "workflow-e5",
                type: "danger",
                label: "danger edge",
                arrowHeadType: "arrowclosed",
                source: "workflow-5",
                target: "workflow-1",
            },
        ],
    },
    graph: {
        nodes: [
            {
                id: "graph-1",
                type: "default",
                data: {
                    label: "Default ",
                    content: "Example content.",
                    minimalShape: "none",
                    menuButtons: <NodeTools>Pass your menu here.</NodeTools>,
                },
                position: { x: 100, y: 50 },
            },
            {
                id: "graph-2",
                type: "graph",
                data: {
                    label: "Graph",
                    content: "Example content.",
                    minimalShape: "none",
                },
                position: { x: 400, y: 200 },
            },
            {
                id: "graph-3",
                type: "class",
                data: {
                    label: "Class",
                    content: "Example content.",
                    minimalShape: "none",
                },
                position: { x: 700, y: 50 },
            },
            {
                id: "graph-4",
                type: "instance",
                targetPosition: Position.Right,
                sourcePosition: Position.Left,
                data: {
                    label: "Instance",
                    content: "Example content.",
                    minimalShape: "none",
                    handles: [
                        { type: "source", position: "left" },
                        { type: "target", position: "right" },
                    ],
                },
                position: { x: 750, y: 300 },
            },
            {
                id: "graph-5",
                type: "property",
                targetPosition: Position.Right,
                sourcePosition: Position.Left,
                data: {
                    label: "Property",
                    content: "Example content.",
                    minimalShape: "none",
                    handles: [
                        { type: "source", position: "left" },
                        { type: "target", position: "right" },
                    ],
                },
                position: { x: 50, y: 300 },
            },
        ],
        edges: [
            {
                id: "graph-e1",
                type: "implicit",
                label: "implicit edge",
                arrowHeadType: "arrowclosed",
                source: "graph-1",
                target: "graph-2",
            },
            {
                id: "graph-e2",
                type: "import",
                label: "import edge",
                arrowHeadType: "arrowclosed",
                source: "graph-2",
                target: "graph-3",
            },
            {
                id: "graph-e3",
                type: "subclass",
                label: "subclass edge",
                arrowHeadType: "arrowclosed",
                source: "graph-3",
                target: "graph-4",
            },
            {
                id: "graph-e4",
                type: "subproperty",
                label: "subproperty edge",
                arrowHeadType: "arrowclosed",
                source: "graph-4",
                target: "graph-5",
            },
            {
                id: "graph-e5",
                type: "rdftype",
                label: "rdftype edge",
                arrowHeadType: "arrowclosed",
                source: "graph-5",
                target: "graph-1",
            },
        ],
    },
};

export default {
    title: "CMEM/React Flow/Configurations",
    component: ReactFlowExtended,
    argTypes: {
        configuration: {
            control: "select",
            options: Object.keys(nodeExamples),
        },
        flowVersion: {
            control: "select",
            options: [undefined, "v9", "v12"],
        },
    },
} as Meta<typeof ReactFlowExtended>;

const ReactFlowExampleV9: FC<ReactFlowExtendedProps> = (args) => {
    const [reactflowInstance, setReactflowInstance] = useState(undefined);
    const [elements, setElements] = useState([] as Elements);
    const [edgeTools, setEdgeTools] = useState<JSX.Element>(<></>);

    useEffect(() => {
        const examples = nodeExamples[args.configuration ?? "unspecified"];
        setElements([...examples.nodes, ...examples.edges] as Elements);
    }, [args]);

    // Helper methods for nodes and edges
    const isNode = (element: FlowElement & { source?: string }): boolean => !element.source;
    const isEdge = (element: FlowElement & { source?: string }): boolean => !isNode(element);

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
                    EdgeTools demo, add elements here.
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

    const reactFlowExtendedProps = {
        ...args,
        defaultZoom: 1,
        elements,
        onLoad,
        onElementClick,
        onEdgeContextMenu: onElementClick,
    };

    return (
        <ApplicationContainer monitorDropzonesFor={args.dropzoneFor} style={{ background: "white" }}>
            <ReactFlowExtended {...reactFlowExtendedProps}>
                <MiniMap flowInstance={reactflowInstance} enableNavigation={true} />
                <BackgroundV9 variant={BackgroundVariantV9.Lines} gap={16} />
            </ReactFlowExtended>
            {edgeTools}
        </ApplicationContainer>
    );
};

const ReactFlowExampleV12: FC<ReactFlowExtendedProps> = (args) => {
    const [nodes, ,] = useNodesState12(nodeExamples[args.configuration ?? "unspecified"].nodes as Node12[]);
    const [edges, ,] = useEdgesState12(nodeExamples[args.configuration ?? "unspecified"].edges as Edge12[]);

    const { style, ...otherProps } = args;
    const { height, width, ...otherStyles } = style ?? {};

    const reactFlowExtendedProps = {
        ...otherProps,
        style: otherStyles,
        defaultViewport: { x: 0, y: 0, zoom: 1 },
        nodes,
        edges,
    };

    return (
        <ApplicationContainer monitorDropzonesFor={args.dropzoneFor} style={{ background: "white" }}>
            <div style={{ height, width }}>
                <ReactFlowExtended {...reactFlowExtendedProps}>
                    <MiniMapV12 enableNavigation />
                    <BackgroundV12 variant={BackgroundVariantV12.Lines} gap={16} />
                </ReactFlowExtended>
            </div>
        </ApplicationContainer>
    );
};

const ReactFlowExample: FC<ReactFlowExtendedProps> = (args) => {
    switch (args.flowVersion) {
        case undefined:
        case "v9":
            return <ReactFlowExampleV9 {...args} />;
        case "v12":
            return <ReactFlowExampleV12 {...args} />;
        default:
            return <></>;
    }
};

let forcedUpdateKey = 0; // @see https://github.com/storybookjs/storybook/issues/13375#issuecomment-1291011856
const Template: StoryFn<typeof ReactFlowExtended> = (args) => <ReactFlowExample {...args} key={++forcedUpdateKey} />;

export const Default = Template.bind({});
Default.args = {
    configuration: "unspecified",
    dropzoneFor: ["Files"],
    "data-test-id": "reactflow-test-id",
    "data-testid": "reactflow-testid",
    style: { height: "400px" },
    onSelectionChange: fn(),
};
Default.nodeExamples = nodeExamples;
