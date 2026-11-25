import React from "react";
import { render, screen } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";

import "@testing-library/jest-dom";

import { NodeContent } from "./NodeContent";

describe("NodeContent vertical sizing", () => {
    it.each([
        { savedHeight: 900, maxHeight: undefined, expectedMaxHeight: "none" },
        { savedHeight: 900, maxHeight: 600, expectedMaxHeight: "600px" },
        { savedHeight: undefined, maxHeight: undefined, expectedMaxHeight: "400px" },
    ])(
        "applies max-height $expectedMaxHeight with saved height $savedHeight and resize limit $maxHeight",
        ({ savedHeight, maxHeight, expectedMaxHeight }) => {
            render(
                <ReactFlowProvider>
                    <style>
                        {'[data-testid="node-content"] { min-width: 75px; min-height: 75px; max-height: 400px; }'}
                    </style>
                    <NodeContent
                        data-testid="node-content"
                        label="Note"
                        size="medium"
                        minimalShape="none"
                        handles={[]}
                        onNodeResize={jest.fn()}
                        nodeDimensions={savedHeight ? { width: 300, height: savedHeight } : undefined}
                        resizeMaxDimensions={maxHeight ? { height: maxHeight } : undefined}
                    />
                </ReactFlowProvider>,
            );

            const node = screen.getByTestId("node-content");
            expect(node).toHaveStyle({ maxHeight: expectedMaxHeight });
            if (savedHeight) {
                const height = Math.min(savedHeight, maxHeight ?? Infinity);
                expect(node).toHaveStyle({ height: `${height}px` });
                expect(node.parentElement).toHaveStyle({ height: `${height}px` });
            }
        },
    );
});
