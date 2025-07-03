import React, { FC, useCallback, useEffect, useState } from "react";
import { Background, BackgroundVariant, Elements } from "react-flow-renderer";
import { Meta, StoryFn } from "@storybook/react";

import { Default as ReactFlowExample } from "../../../cmem/react-flow/ReactFlow/ReactFlow.stories";

import { ApplicationContainer, MiniMap, MiniMapProps, ReactFlowExtended } from "./../../../index";

export default {
    title: "Extensions/React Flow/MiniMap",
    component: MiniMap,
    argTypes: {},
} as Meta<typeof MiniMap>;

const MiniMapExample: FC<MiniMapProps> = (args) => {
    const [reactflowInstance, setReactflowInstance] = useState(undefined);
    const [elements, setElements] = useState([] as Elements);
    const nodeExamples = ReactFlowExample.nodeExamples.workflow;

    useEffect(() => {
        setElements([...nodeExamples.nodes, ...nodeExamples.edges] as Elements);
    }, [args]);

    const onLoad = useCallback((rfi) => {
        if (!reactflowInstance) {
            setReactflowInstance(rfi);
        }
    }, []);

    return (
        <ApplicationContainer style={{ background: "white" }}>
            <ReactFlowExtended
                configuration={"workflow"}
                elements={elements}
                style={{ height: "400px" }}
                onLoad={onLoad}
                defaultZoom={1}
            >
                <MiniMap flowInstance={reactflowInstance} {...args} />
                <Background variant={BackgroundVariant.Lines} gap={16} />
            </ReactFlowExtended>
        </ApplicationContainer>
    );
};

let forcedUpdateKey = 0; // @see https://github.com/storybookjs/storybook/issues/13375#issuecomment-1291011856
const Template: StoryFn<MiniMapProps> = (args) => <MiniMapExample {...args} key={++forcedUpdateKey} />;

export const Default = Template.bind({});
Default.args = {
    enableNavigation: true,
    wrapperProps: {
        "data-test-id": "minimap-test-id",
        "data-testid": "minimap-testid",
    },
};
