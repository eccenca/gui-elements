import React, { useCallback, useEffect, useState } from "react";
import { Elements, ReactFlowProvider } from "react-flow-renderer";
import { Meta, StoryFn } from "@storybook/react";

import { Definitions } from "../../../../common/Intent";

import { HandleDefault, HandleProps, HandleTools, ReactFlow } from "./../../../../../index";
import { edgeTypes } from "./../../edges/edgeTypes";

const HandleDefaultDataProps = (data: HandleProps["data"]) => {
    // this is only a mock to get it as sub element in the table
    return <>{data.extendedTooltip}</>;
};

export default {
    title: "Extensions/React Flow/Handle",
    component: HandleDefault,
    subcomponents: { HandleDefaultDataProps, HandleTools },
    argTypes: {
        intent: {
            control: "select",
            options: { "Not set": undefined, ...Definitions },
        },
    },
} as Meta<typeof HandleDefault>;

const HandleDefaultExample = (args: any) => {
    const [reactflowInstance, setReactflowInstance] = useState(null);
    const [elements, setElements] = useState([] as Elements);

    useEffect(() => {
        setElements([
            {
                id: "node-1",
                type: "default",
                data: {
                    label: "Default ",
                    content: "Example content.",
                    minimalShape: "none",
                    handles: [{ ...args }],
                },
                position: { x: 50, y: 200 },
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

const Template: StoryFn<typeof HandleDefault> = (args) => <HandleDefaultExample {...args} />;

export const Default = Template.bind({});
Default.args = {
    type: "target",
    tooltip: "this is a target handle",
    isConnectable: true,
};

export const UsingHandleTools = Template.bind({});
UsingHandleTools.args = {
    type: "source",
    tooltip: "this is a handle with tools overlay",
    isConnectable: true,
    children: <HandleTools>Content could be an menu, or something else.</HandleTools>,
};
