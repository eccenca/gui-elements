import * as React from "react";

import { cn } from "@/common/utils/cn";
import { Icon } from "@/components/atoms/Icon/Icon";
import { IconProps } from "@/components/atoms/Icon/Icon";
import { TestIconProps } from "@/components/atoms/Icon/TestIcon";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

/*
 * Headless re-implementation of the former BlueprintJS `<Tree />` wrapper.
 *
 * The public API is kept structurally identical to the previous Blueprint-backed
 * version (`TreeNodeInfo`, `TreeProps`, the `onNode*` callbacks and their
 * `(node, nodePath, event)` signature) so the ~8 consuming files in the app keep
 * working unchanged.
 *
 * Like Blueprint the component is *fully controlled*: it holds no internal state.
 * Expansion and selection are driven purely by the `isExpanded` / `isSelected`
 * flags on each node; consumers mutate their own `contents` data in the
 * `onNodeExpand` / `onNodeCollapse` handlers and re-render.
 *
 * Only our own `<Icon />` elements should be used inside the tree nodes.
 */

/** An element that may be rendered, or a falsy value that renders nothing. */
type MaybeElement = React.JSX.Element | false | null | undefined;

// how much each nesting level is indented, in pixels (matches the former Blueprint step)
const INDENT_PER_LEVEL = 22;

// == TreeNode =================================================================

export interface TreeNodeInfo<T = {}> {
    /**
     * A space-delimited list of class names for this tree node element.
     */
    className?: string;
    /**
     * Child tree nodes of this node.
     */
    childNodes?: Array<TreeNodeInfo<T>>;
    /**
     * Whether this tree node is non-interactive. Enabling this prop will ignore
     * mouse event handlers (in particular click, down, enter, leave).
     */
    disabled?: boolean;
    /**
     * Whether the caret to expand/collapse a node should be shown.
     * If not specified, this will be true if the node has children and false otherwise.
     */
    hasCaret?: boolean;
    /**
     * `<Icon />` element to render next to the node's label.
     */
    icon?: React.ReactElement<IconProps> | React.ReactElement<TestIconProps>;
    /**
     * A unique identifier for the node.
     */
    id: string | number;
    /**
     * Whether the node is expanded, showing its child nodes.
     */
    isExpanded?: boolean;
    /**
     * Whether this node is selected.
     *
     * @default false
     */
    isSelected?: boolean;
    /**
     * The main label for the node.
     */
    label: string | React.JSX.Element;
    /**
     * A secondary label/component that is displayed at the right side of the node.
     */
    secondaryLabel?: string | MaybeElement;
    /**
     * An optional custom user object to associate with the node.
     * This property can then be used in the `onNodeClick`, `onNodeContextMenu` and `onNodeDoubleClick`
     * event handlers for doing custom logic per node.
     */
    nodeData?: T;
}

/**
 * Event handler for tree node interactions.
 * `nodePath` is the list of child indices from the tree root down to the affected node
 * (e.g. the second child of the first root node has the path `[0, 1]`).
 */
export type TreeEventHandler<T = {}> = (
    node: TreeNodeInfo<T>,
    nodePath: number[],
    e: React.MouseEvent<HTMLElement>,
) => void;

export interface TreeNodeProps<T = {}> extends TreeNodeInfo<T> {
    children?: React.ReactNode;
    /**
     * Whether to use a compact appearance which reduces the visual padding around node content.
     */
    compact?: boolean;
    contentRef?: (node: TreeNodeProps<T>, element: HTMLDivElement | null) => void;
    depth: number;
    key?: string | number;
    onClick?: TreeEventHandler<T>;
    onCollapse?: TreeEventHandler<T>;
    onContextMenu?: TreeEventHandler<T>;
    onDoubleClick?: TreeEventHandler<T>;
    onExpand?: TreeEventHandler<T>;
    onMouseEnter?: TreeEventHandler<T>;
    onMouseLeave?: TreeEventHandler<T>;
    path: number[];
}

/**
 * Exported for API parity with the former Blueprint-backed implementation.
 * The actual rendering is done internally by `Tree`; nothing in the app renders
 * `<TreeNode />` directly.
 */
export class TreeNode<T = {}> extends React.Component<TreeNodeProps<T>> {}

export class TreeNodeShadow<T = {}> extends React.Component<TreeNodeProps<T>> {
    // only provided for Storybook, so it can read the correct interface
}

/** Internal handler collection threaded down through the recursion. */
interface TreeNodeHandlers<T> {
    onNodeClick?: TreeEventHandler<T>;
    onNodeCollapse?: TreeEventHandler<T>;
    onNodeContextMenu?: TreeEventHandler<T>;
    onNodeDoubleClick?: TreeEventHandler<T>;
    onNodeExpand?: TreeEventHandler<T>;
    onNodeMouseEnter?: TreeEventHandler<T>;
    onNodeMouseLeave?: TreeEventHandler<T>;
}

interface TreeNodeElementProps<T> extends TreeNodeHandlers<T> {
    node: TreeNodeInfo<T>;
    depth: number;
    path: number[];
    compact: boolean;
}

/** Renders a single tree node (its content row plus, when expanded, its child list). */
function TreeNodeElement<T>({
    node,
    depth,
    path,
    compact,
    onNodeClick,
    onNodeCollapse,
    onNodeContextMenu,
    onNodeDoubleClick,
    onNodeExpand,
    onNodeMouseEnter,
    onNodeMouseLeave,
}: TreeNodeElementProps<T>): React.JSX.Element {
    const disabled = node.disabled === true;
    const isExpanded = node.isExpanded === true;
    const isSelected = node.isSelected === true;
    const hasChildren = !!node.childNodes && node.childNodes.length > 0;
    const showCaret = node.hasCaret ?? hasChildren;

    const fire = (handler?: TreeEventHandler<T>) => (e: React.MouseEvent<HTMLElement>) => handler?.(node, path, e);

    const handleCaretClick = (e: React.MouseEvent<HTMLElement>) => {
        // caret clicks must not bubble up to the node-content `onClick`
        e.stopPropagation();
        (isExpanded ? onNodeCollapse : onNodeExpand)?.(node, path, e);
    };

    // disabled nodes ignore all mouse interaction (matches Blueprint behaviour)
    const contentEventHandlers = disabled
        ? {}
        : {
              onClick: fire(onNodeClick),
              onContextMenu: fire(onNodeContextMenu),
              onDoubleClick: fire(onNodeDoubleClick),
              onMouseEnter: fire(onNodeMouseEnter),
              onMouseLeave: fire(onNodeMouseLeave),
          };

    return (
        <li
            role="treeitem"
            aria-level={depth + 1}
            aria-expanded={showCaret ? isExpanded : undefined}
            aria-selected={node.isSelected}
            aria-disabled={disabled || undefined}
            className={cn(
                `${eccgui}-tree__node`,
                isSelected && `${eccgui}-tree__node--selected`,
                isExpanded && `${eccgui}-tree__node--expanded`,
                disabled && `${eccgui}-tree__node--disabled`,
                node.className,
            )}
        >
            <div
                className={cn(
                    `${eccgui}-tree__node-content`,
                    "flex items-center rounded-sm px-2 text-sm",
                    compact ? "min-h-6" : "min-h-8",
                    disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                    isSelected
                        ? "bg-accent text-accent-foreground"
                        : !disabled && "hover:bg-accent hover:text-accent-foreground",
                )}
                style={{ paddingLeft: depth * INDENT_PER_LEVEL }}
                {...contentEventHandlers}
            >
                {showCaret ? (
                    <button
                        type="button"
                        aria-label={isExpanded ? "Collapse group" : "Expand group"}
                        tabIndex={disabled ? -1 : 0}
                        disabled={disabled}
                        className={cn(
                            `${eccgui}-tree__node-caret`,
                            "flex size-5 shrink-0 items-center justify-center border-0 bg-transparent p-0",
                            disabled ? "cursor-not-allowed" : "cursor-pointer",
                        )}
                        onClick={disabled ? undefined : handleCaretClick}
                    >
                        <Icon
                            name="toggler-caretright"
                            small
                            aria-hidden
                            className={cn(
                                "text-muted-foreground transition-transform",
                                isExpanded && "rotate-90",
                            )}
                        />
                    </button>
                ) : (
                    <span className={cn(`${eccgui}-tree__node-caret-none`, "size-5 shrink-0")} aria-hidden />
                )}
                {node.icon != null ? (
                    <span className={cn(`${eccgui}-tree__node-icon`, "mr-2 flex shrink-0 items-center")}>
                        {node.icon}
                    </span>
                ) : null}
                <span className={cn(`${eccgui}-tree__node-label`, "min-w-0 flex-1 overflow-visible")}>
                    {node.label}
                </span>
                {node.secondaryLabel != null ? (
                    <span className={cn(`${eccgui}-tree__node-secondary-label`, "ml-2 shrink-0")}>
                        {node.secondaryLabel}
                    </span>
                ) : null}
            </div>
            {isExpanded && hasChildren ? (
                <ul role="group" className={cn(`${eccgui}-tree__node-list`, "m-0 list-none p-0")}>
                    {node.childNodes!.map((child, i) => (
                        <TreeNodeElement
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            path={path.concat(i)}
                            compact={compact}
                            onNodeClick={onNodeClick}
                            onNodeCollapse={onNodeCollapse}
                            onNodeContextMenu={onNodeContextMenu}
                            onNodeDoubleClick={onNodeDoubleClick}
                            onNodeExpand={onNodeExpand}
                            onNodeMouseEnter={onNodeMouseEnter}
                            onNodeMouseLeave={onNodeMouseLeave}
                        />
                    ))}
                </ul>
            ) : null}
        </li>
    );
}

// == Tree =====================================================================

export interface TreeProps<T = {}> {
    /**
     * A space-delimited list of class names to pass along to the root element.
     */
    className?: string;
    /**
     * Whether to use a compact appearance which reduces the visual padding around node content.
     */
    compact?: boolean;
    /**
     * Tree contents.
     */
    contents: ReadonlyArray<TreeNodeInfo<T>>;
    /**
     * Invoked when a node is clicked anywhere other than the caret for expanding/collapsing the node.
     */
    onNodeClick?: TreeEventHandler<T>;
    /**
     * Invoked when the caret of an expanded node is clicked.
     */
    onNodeCollapse?: TreeEventHandler<T>;
    /**
     * Invoked when a node is right-clicked.
     */
    onNodeContextMenu?: TreeEventHandler<T>;
    /**
     * Invoked when a node is double-clicked.
     */
    onNodeDoubleClick?: TreeEventHandler<T>;
    /**
     * Invoked when the caret of a collapsed node is clicked.
     */
    onNodeExpand?: TreeEventHandler<T>;
    /**
     * Invoked when the mouse is moved over a node.
     */
    onNodeMouseEnter?: TreeEventHandler<T>;
    /**
     * Invoked when the mouse is moved out of a node.
     */
    onNodeMouseLeave?: TreeEventHandler<T>;
}

/**
 * Tree component to display a tree structure.
 *
 * The component is fully controlled: it renders exactly what `contents` describes and
 * never stores expansion/selection state itself. Use the `onNode*` handlers to update
 * your own data and re-render.
 *
 * Use only our `<Icon />` elements in the tree nodes!
 */
export function Tree<T = {}>({
    className = "",
    compact = false,
    contents,
    onNodeClick,
    onNodeCollapse,
    onNodeContextMenu,
    onNodeDoubleClick,
    onNodeExpand,
    onNodeMouseEnter,
    onNodeMouseLeave,
}: TreeProps<T>): React.JSX.Element {
    return (
        <ul role="tree" className={cn(`${eccgui}-tree`, "m-0 list-none overflow-x-hidden p-0", className)}>
            {contents.map((node, i) => (
                <TreeNodeElement
                    key={node.id}
                    node={node}
                    depth={0}
                    path={[i]}
                    compact={compact}
                    onNodeClick={onNodeClick}
                    onNodeCollapse={onNodeCollapse}
                    onNodeContextMenu={onNodeContextMenu}
                    onNodeDoubleClick={onNodeDoubleClick}
                    onNodeExpand={onNodeExpand}
                    onNodeMouseEnter={onNodeMouseEnter}
                    onNodeMouseLeave={onNodeMouseLeave}
                />
            ))}
        </ul>
    );
}

export default Tree;
