import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { CLASSPREFIX as eccgui } from "@/configuration/constants";

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
    // Regression: the handle content used to be memoized with empty deps, freezing the tooltip's
    // controlled `isOpen` at false — the extended tooltip never showed.
    it("shows the extended tooltip on handle hover", async () => {
        render(
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
            />,
        );

        fireEvent.mouseEnter(screen.getByTestId("handle"));

        // Radix portals the overlay to document.body and adds a visually-hidden a11y duplicate of
        // the content, so scope the query to the single visible overlay element.
        await waitFor(() => {
            const overlay = document.querySelector(`.${eccgui}-tooltip__content`);
            expect(overlay).toBeInTheDocument();
            expect(overlay).toHaveTextContent("This is another Tooltip");
        });
    });
});
