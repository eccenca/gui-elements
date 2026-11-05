import React from "react";
import { OverlaysProvider } from "@blueprintjs/core";
import { fireEvent, render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import Menu from "../../../components/Menu/Menu";
import MenuItem from "../../../components/Menu/MenuItem";
import { EdgeTools } from "../edges/EdgeTools";
import { HandleTools } from "../handles/HandleTools";
import { NodeTools } from "../nodes/NodeTools";

it("preserves the menu announcement for node actions", async () => {
    render(
        <OverlaysProvider>
            <NodeTools togglerText="Node actions">
                <Menu>
                    <MenuItem text="Delete node" />
                </Menu>
            </NodeTools>
        </OverlaysProvider>,
    );
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    fireEvent.click(trigger);
    expect(await screen.findByRole("menu")).toBeVisible();
});

it("preserves the menu announcement for handle actions", async () => {
    render(
        <OverlaysProvider>
            <HandleTools data-testid="handle-actions">
                <Menu>
                    <MenuItem text="Show schema" />
                </Menu>
            </HandleTools>
        </OverlaysProvider>,
    );
    const trigger = screen.getByTestId("handle-actions");
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    fireEvent.click(trigger);
    expect(await screen.findByRole("menu")).toBeVisible();
});

it("does not advertise a menu for edge action buttons", async () => {
    const { container } = render(
        <OverlaysProvider>
            <EdgeTools posOffset={{ left: 0, top: 0 }}>
                <button>Delete connection</button>
            </EdgeTools>
        </OverlaysProvider>,
    );
    expect(await screen.findByRole("button", { name: "Delete connection" })).toBeVisible();
    expect(container.querySelector('[aria-haspopup="menu"]')).toBeNull();
});
