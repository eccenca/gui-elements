import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { OverlaysProvider } from "@blueprintjs/core";
import "@testing-library/jest-dom";

import { HandleDefault } from "../HandleDefault";

jest.mock("react-flow-renderer", () => {
    const React = require("react");
    return {
        Handle: React.forwardRef(
            ({ children, isConnectable, position, type, ...props }: any, ref: React.Ref<HTMLDivElement>) => (
                <div ref={ref} {...props}>
                    {children}
                </div>
            ),
        ),
    };
});

jest.mock("@xyflow/react", () => {
    const React = require("react");
    return {
        Handle: React.forwardRef(
            ({ children, isConnectable, position, type, ...props }: any, ref: React.Ref<HTMLDivElement>) => (
                <div ref={ref} {...props}>
                    {children}
                </div>
            ),
        ),
    };
});

jest.mock("../../versionsupport", () => ({
    useReactFlowVersion: () => "v9",
}));

describe("HandleDefault", () => {
    it("shows the extended tooltip on handle hover", async () => {
        render(
            <OverlaysProvider>
                <HandleDefault
                    type="target"
                    isConnectable={true}
                    data-testid="handle"
                    data={{
                        extendedTooltip: "This is another Tooltip",
                        tooltipProps: {
                            hoverOpenDelay: 0,
                        },
                    }}
                />
            </OverlaysProvider>,
        );

        fireEvent.mouseEnter(screen.getByTestId("handle"));

        expect(await screen.findByText("This is another Tooltip")).toBeVisible();
    });
});
