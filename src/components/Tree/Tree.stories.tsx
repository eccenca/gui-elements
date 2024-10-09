import React from "react";
import { LogoReact } from "@carbon/icons-react";
import { Meta, StoryFn } from "@storybook/react";

import { Icon, OverflowText, Tag, TestIcon, Tree, TreeNodeInfo } from "./../../index";
import { TreeNodeShadow as TreeNode } from "./Tree";

export default {
    title: "Components/Tree",
    component: Tree,
    subcomponents: { TreeNode },
    argTypes: {},
} as Meta<typeof Tree>;

const Template: StoryFn<typeof Tree> = (args) => {
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
                    label: (
                        <>
                            Tree item 1a with <Tag>Tag</Tag>
                        </>
                    ),
                },
                {
                    id: 2,
                    label: "Tree item 1b with a very long label that is not ellipsed on overflow",
                },
                {
                    id: 3,
                    label: (
                        <OverflowText inline>
                            Tree item 1c with a very long label that is ellipsed on overflow
                        </OverflowText>
                    ),
                },
                {
                    id: 4,
                    label: "Tree item 1d with icon",
                    icon: <Icon name="item-info" />,
                },
                {
                    id: 5,
                    label: "Tree item 1e with test icon",
                    icon: <TestIcon tryout={LogoReact} />,
                },
            ],
        },
        {
            id: 5,
            label: "Tree item 2",
            hasCaret: true,
        },
    ] as TreeNodeInfo[],
};
