import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Tree, TreeNodeInfo, Tag, OverflowText, Icon } from "./../../index";
import { TreeNodeShadow as TreeNode } from "./Tree";

export default {
    title: "Components/Tree",
    component: Tree,
    subcomponents: { TreeNode },
    argTypes: {
    },
} as ComponentMeta<typeof Tree>;

const Template: ComponentStory<typeof Tree> = (args) => {
    const [treeContents, setTreeContents] = React.useState(args.contents);

    return (
        <Tree
            {...args}
            contents={treeContents}
            /*
            FIXME: should be demonstrated but is not the focus here
            onNodeCollapse={toggleNode}
            onNodeExpand={toggleNode}
            */
        />
    );
};

export const Default = Template.bind({});
Default.args = {
    contents: [
        {
            id: 0,
            label: "Tree item 1",
            isExpanded: true,
            childNodes: [
                {
                    id: 1,
                    label: <>Tree item 1a with{" "}<Tag>Tag</Tag></>,
                },
                {
                    id: 2,
                    label: "Tree item 1b with a very long label that is not ellipsed on overflow",
                },
                {
                    id: 3,
                    label: <OverflowText inline>Tree item 1c with a very long label that is ellipsed on overflow</OverflowText>,
                },
                {
                    id: 4,
                    label: "Tree item 1d with icon",
                    icon: <Icon name="item-info" />
                },
            ]
        },
        {
            id: 5,
            label: "Tree item 2",
            hasCaret: true,
        },
    ] as TreeNodeInfo[]
}
