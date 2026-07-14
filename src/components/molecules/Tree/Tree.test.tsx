import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { CLASSPREFIX as eccgui } from "@/configuration/constants";
import { Tree, TreeNodeInfo } from "@/index";

import "@testing-library/jest-dom";

/** A small three-level tree: root (expanded) → [Child A (leaf), Child B (collapsed) → Grandchild]. */
const buildContents = (overrides: Partial<TreeNodeInfo> = {}): TreeNodeInfo[] => [
    {
        id: "root",
        label: "Root",
        hasCaret: true,
        isExpanded: true,
        childNodes: [
            { id: "child-a", label: "Child A" },
            {
                id: "child-b",
                label: "Child B",
                hasCaret: true,
                isExpanded: false,
                childNodes: [{ id: "grandchild", label: "Grandchild" }],
            },
        ],
        ...overrides,
    },
];

describe("Tree", () => {
    it("renders an accessible tree and only shows children of expanded nodes", () => {
        render(<Tree contents={buildContents()} />);

        expect(screen.getByRole("tree")).toBeInTheDocument();
        expect(screen.getByText("Root")).toBeInTheDocument();
        // root is expanded -> its children render
        expect(screen.getByText("Child A")).toBeInTheDocument();
        expect(screen.getByText("Child B")).toBeInTheDocument();
        // child-b is collapsed -> its child must NOT be in the DOM
        expect(screen.queryByText("Grandchild")).not.toBeInTheDocument();
    });

    it("fires onNodeExpand with the node and its nodePath when a collapsed caret is clicked", () => {
        const onNodeExpand = jest.fn();
        render(<Tree contents={buildContents()} onNodeExpand={onNodeExpand} />);

        // only child-b is collapsed, so it owns the single "Expand group" caret
        fireEvent.click(screen.getByRole("button", { name: "Expand group" }));

        expect(onNodeExpand).toHaveBeenCalledTimes(1);
        const [node, nodePath] = onNodeExpand.mock.calls[0];
        expect(node.id).toBe("child-b");
        expect(nodePath).toEqual([0, 1]); // second child of the first root node
    });

    it("fires onNodeCollapse for an expanded caret and never bubbles a caret click into onNodeClick", () => {
        const onNodeCollapse = jest.fn();
        const onNodeClick = jest.fn();
        render(<Tree contents={buildContents()} onNodeCollapse={onNodeCollapse} onNodeClick={onNodeClick} />);

        // root is expanded -> "Collapse group"
        fireEvent.click(screen.getByRole("button", { name: "Collapse group" }));

        expect(onNodeCollapse).toHaveBeenCalledTimes(1);
        expect(onNodeCollapse.mock.calls[0][0].id).toBe("root");
        expect(onNodeCollapse.mock.calls[0][1]).toEqual([0]);
        // stopPropagation on the caret must keep the row click from firing
        expect(onNodeClick).not.toHaveBeenCalled();
    });

    it("fires onNodeClick with the correct nodePath when a node row is clicked", () => {
        const onNodeClick = jest.fn();
        render(<Tree contents={buildContents()} onNodeClick={onNodeClick} />);

        fireEvent.click(screen.getByText("Child A"));

        expect(onNodeClick).toHaveBeenCalledTimes(1);
        expect(onNodeClick.mock.calls[0][0].id).toBe("child-a");
        expect(onNodeClick.mock.calls[0][1]).toEqual([0, 0]);
    });

    it("is fully controlled: clicking a caret does not change the rendered tree until contents change", () => {
        const { container, rerender } = render(<Tree contents={buildContents()} onNodeExpand={jest.fn()} />);

        // clicking expand does NOT reveal the grandchild by itself (Tree holds no state)
        fireEvent.click(screen.getByRole("button", { name: "Expand group" }));
        expect(screen.queryByText("Grandchild")).not.toBeInTheDocument();

        // consumer updates its own data (child-b now expanded) and re-renders -> grandchild appears
        const expanded = buildContents();
        expanded[0].childNodes![1].isExpanded = true;
        rerender(<Tree contents={expanded} onNodeExpand={jest.fn()} />);
        expect(screen.getByText("Grandchild")).toBeInTheDocument();

        // a selected node carries the selected class + aria-selected
        expect(container.querySelector(`.${eccgui}-tree__node`)).toBeInTheDocument();
    });

    it("renders selection state via class + aria-selected", () => {
        const contents: TreeNodeInfo[] = [{ id: "n1", label: "Selected node", isSelected: true }];
        const { container } = render(<Tree contents={contents} />);

        const selected = container.querySelector(`.${eccgui}-tree__node--selected`);
        expect(selected).toBeInTheDocument();
        expect(selected).toHaveAttribute("aria-selected", "true");
    });

    it("ignores mouse handlers on disabled nodes and marks them as disabled", () => {
        const onNodeClick = jest.fn();
        const contents: TreeNodeInfo[] = [{ id: "n1", label: "Disabled node", disabled: true }];
        const { container } = render(<Tree contents={contents} onNodeClick={onNodeClick} />);

        fireEvent.click(screen.getByText("Disabled node"));
        expect(onNodeClick).not.toHaveBeenCalled();

        const node = container.querySelector(`.${eccgui}-tree__node--disabled`);
        expect(node).toBeInTheDocument();
        expect(node).toHaveAttribute("aria-disabled", "true");
    });
});
