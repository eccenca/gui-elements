import React, { useCallback, useEffect, useState } from "react";
import { Elements } from "react-flow-renderer";
import { Meta, StoryFn } from "@storybook/react";

import { ReactFlow } from "./../../../../cmem";
import { NodeContent } from "./../NodeContent";
import { NodeDefault } from "./../NodeDefault";
import { Default as NodeContentExample } from "./NodeContent.stories";
import { nodeTypes } from "./nodeTypes";

export default {
    title: "Extensions/React Flow/Node",
    component: NodeDefault,
    argTypes: {
        id: {
            control: "text",
            description: "Internal node identifier.",
        },
        position: {
            type: { required: true },
            description: "Position on React-Flow canvas.",
            table: {
                type: { summary: "XYPosition" },
            },
        },
        type: {
            control: "select",
            description: "Key of the imported and connected `nodeTypes` to specify what node implementation is used.",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "default" },
            },
            options: Object.keys(nodeTypes),
            mapping: Object.fromEntries(Object.keys(nodeTypes).map((type) => [type, type])),
        },
        style: {
            control: "object",
            description: "css properties",
            table: {
                type: { summary: "React.CSSProperties" },
            },
        },
        className: {
            control: "text",
            description: "additional class name",
        },
        targetPosition: {
            description: "'left' | 'right' | 'top' | 'bottom' handle position",
            table: {
                type: { summary: "Position" },
                defaultValue: { summary: "Position.Left" },
            },
        },
        sourcePosition: {
            description: "'left' | 'right' | 'top' | 'bottom' handle position",
            table: {
                type: { summary: "Position" },
                defaultValue: { summary: "Position.Right" },
            },
        },
        isHidden: {
            control: "boolean",
            description: "if true, the node will not be rendered",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
            },
        },
        draggable: {
            control: "boolean",
            description: "if option is not set, the node is draggable (overwrites general nodesDraggable option)",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "true" },
            },
        },
        connectable: {
            control: "boolean",
            description: "if option is not set, the node is connectable (overwrites general nodesConnectable option)",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "true" },
            },
        },
        selectable: {
            control: "boolean",
            description: "if option is not set, the node is selectable (overwrites general elementsSelectable option)",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "true" },
            },
        },
        dragHandle: {
            control: "text",
            description: "selector for specifying an element as a drag handle",
        },
    },
} as Meta<typeof NodeDefault>;

const NodeDefaultExample = (args: any) => {
    const [reactflowInstance, setReactflowInstance] = useState(null);
    const [elements, setElements] = useState([] as Elements);
    //const [edgeTools, setEdgeTools] = useState<JSX.Element>(<></>);

    useEffect(() => {
        setElements([args] as Elements);
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
        <ReactFlow
            elements={elements}
            style={{ height: "400px" }}
            onLoad={onLoad}
            nodeTypes={nodeTypes}
            defaultZoom={1}
        />
    );
};

const Template: StoryFn<typeof NodeDefault> = (args) => <NodeDefaultExample {...args} /*some comment*/ />;

export const Default = Template.bind({});
Default.args = {
    id: "1",
    type: "default",
    data: NodeContentExample.args,
    position: { x: 50, y: 50 },
};
