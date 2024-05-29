import React, { FC, useCallback, useEffect, useState } from "react";
import { Background, BackgroundVariant, Elements, FlowElement } from "react-flow-renderer";
import { OverlaysProvider } from "@blueprintjs/core";
import { Meta, StoryFn } from "@storybook/react";

import { Default as ReactFlowExample } from "../../../cmem/react-flow/ReactFlow/ReactFlow.stories";

import { MiniMap as MiniMapElement, MiniMapProps, ReactFlow, ReactFlowProps } from "./../../../../index";

export default {
    title: "Extensions/React Flow/MiniMap",
    component: MiniMapElement,
    argTypes: {},
} as Meta<typeof MiniMapElement>;

const MiniMapExample: FC<MiniMapProps> = (args) => {
    const [reactflowInstance, setReactflowInstance] = useState(undefined);
    const [elements, setElements] = useState([] as Elements);
    const [edgeTools, setEdgeTools] = useState<JSX.Element>(<></>);
    const nodeExamples = ReactFlowExample.nodeExamples.workflow;

    useEffect(() => {
        setElements(nodeExamples as Elements);
    }, [args]);

    // Helper methods for nodes and edges
    const isNode = (element: FlowElement & { source?: string }): boolean => !element.source;
    const isEdge = (element: FlowElement & { source?: string }): boolean => !isNode(element);

    const onLoad = useCallback((rfi) => {
        if (!reactflowInstance) {
            setReactflowInstance(rfi);
        }
    }, []);

    return (
        <OverlaysProvider>
            <ReactFlow
                configuration={"workflow"}
                elements={elements}
                style={{ height: "400px" }}
                onLoad={onLoad}
                defaultZoom={1}
            >
                <MiniMapElement flowInstance={reactflowInstance} {...args} />
                <Background variant={BackgroundVariant.Lines} gap={16} />
            </ReactFlow>
            {edgeTools}
        </OverlaysProvider>
    );
};

const Template: StoryFn<typeof MiniMapExample> = (args) => <MiniMapExample {...args} />;

export const Default = Template.bind({});
Default.args = {
    enableNavigation: true,
    wrapperProps: {
        "data-test-id": "minimap-test-id",
        "data-testid": "minimap-testid",
    },
};
