import * as React from "react";
import {
    Tree as BlueprintTree,
    TreeProps as BlueprintTreeProps,
    TreeNode as BlueprintTreeNode,
    TreeNodeInfo as BlueprintTreeNodeInfo,
} from "@blueprintjs/core";
import { IconProps } from "./../Icon/Icon";
import { TestIconProps } from "./../Icon/TestIcon";

/* This is basically a tunnel to the Blueprint elements but we change a view thigs regarding the icons */

// TreeNode

export interface TreeNodeInfo<T = {}> extends Omit<BlueprintTreeNodeInfo<T>, "childNodes" | "icon"> {
    /**
     * Child tree nodes of this node.
     */
    childNodes?: Array<TreeNodeInfo<T>>;
    /**
     * `<Icon />` element to render next to the node's label.
     */
    icon?: React.ReactElement<IconProps> | React.ReactElement<TestIconProps>;
}

//export const TreeNode = BlueprintTreeNode;

export interface TreeNodeProps<T = {}> extends TreeNodeInfo<T> {
    children?: React.ReactNode;
    contentRef?: (node: TreeNode<T>, element: HTMLDivElement | null) => void;
    depth: number;
    key?: string | number;
    onClick?: (node: TreeNode<T>, e: React.MouseEvent<HTMLDivElement>) => void;
    onCollapse?: (node: TreeNode<T>, e: React.MouseEvent<HTMLSpanElement>) => void;
    onContextMenu?: (node: TreeNode<T>, e: React.MouseEvent<HTMLDivElement>) => void;
    onDoubleClick?: (node: TreeNode<T>, e: React.MouseEvent<HTMLDivElement>) => void;
    onExpand?: (node: TreeNode<T>, e: React.MouseEvent<HTMLSpanElement>) => void;
    onMouseEnter?: (node: TreeNode<T>, e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseLeave?: (node: TreeNode<T>, e: React.MouseEvent<HTMLDivElement>) => void;
    path: number[];
}
export class TreeNode<T = {}> extends BlueprintTreeNode<TreeNodeProps<T>> {
}
export class TreeNodeShadow<T = {}> extends React.Component<TreeNodeProps<T>> {
    // only provided for Storybook, so it can read the correct interface
}

// Tree

export interface TreeProps<T = {}> extends Omit<BlueprintTreeProps<T>, "contents"> {
    /**
     * Tree contents.
     */
    contents: ReadonlyArray<TreeNodeInfo<T>>;
}

/**
 * Tree component to display a tree structure.
 * Have a look to the underlaying [BlueprintJS Tree](https://blueprintjs.com/docs/#core/components/tree) component for examples how to use handlers.
 * Use only our `<Icon />` elements in the tree nodes!
 */
export const Tree = BlueprintTree;
