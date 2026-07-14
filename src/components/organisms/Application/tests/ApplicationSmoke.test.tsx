/*
 * Contract test for the surviving Application shell parts: the public classnames
 * (`eccgui-application__*`), landmark roles and aria attributes are part of the frozen DOM
 * contract (application stylesheets and the dropzone monitoring select on them) and must be
 * kept stable. The deprecated header/title/sidebar/toolbar shell components were removed after
 * the sidebar-07 migration (2026-07); only Container/Content/ToolbarAction/ToolbarPanel remain.
 */
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { ApplicationContainer, ApplicationContent, ApplicationToolbarAction, ApplicationToolbarPanel } from "@/index";

import "@testing-library/jest-dom";

describe("Application shell (smoke)", () => {
    it("renders container, content and toolbar action/panel with preserved classnames", () => {
        const onAction = jest.fn();
        const onLeave = jest.fn();
        const { container } = render(
            <ApplicationContainer monitorDropzonesFor={["application/reactflow", "Files"]}>
                <ApplicationToolbarAction
                    id="headerUserMenu"
                    aria-label="Open user menu"
                    tooltipAlignment="end"
                    isActive={false}
                    onClick={onAction}
                >
                    <span>icon</span>
                </ApplicationToolbarAction>
                <ApplicationToolbarPanel aria-label="User menu" expanded={true} onLeave={onLeave}>
                    panel content
                </ApplicationToolbarPanel>
                <ApplicationContent isApplicationSidebarExpanded={true} isApplicationSidebarRail={false}>
                    content
                </ApplicationContent>
            </ApplicationContainer>,
        );

        // container + landmark
        expect(container.querySelector(".eccgui-application__container")).toBeInTheDocument();
        expect(container.querySelector("main.eccgui-application__content")).toBeInTheDocument();
        expect(container.querySelector(".eccgui-application__content--withsidebar")).toBeInTheDocument();

        // action + panel
        const action = container.querySelector("button#headerUserMenu");
        expect(action!.className).toContain("eccgui-application__toolbar__action");
        fireEvent.click(action!);
        expect(onAction).toHaveBeenCalled();
        expect(container.querySelector(".eccgui-application__toolbar__panel")).toHaveAttribute(
            "aria-label",
            "User menu",
        );
        expect(container.querySelector(".eccgui-application__toolbar__panel-backdrop--onleave")).toBeInTheDocument();

        // no Carbon or Blueprint classnames left anywhere
        expect(container.querySelectorAll("[class*='cds--']").length).toBe(0);
        expect(container.querySelectorAll("[class*='bp6-']").length).toBe(0);
    });

    it("shows the toolbar action label as tooltip content on focus", async () => {
        render(
            <ApplicationToolbarAction aria-label="Open notifications menu" isActive={false}>
                <span>icon</span>
            </ApplicationToolbarAction>,
        );
        const button = screen.getByRole("button", { name: "Open notifications menu" });
        fireEvent.focus(button);
        expect(await screen.findAllByText("Open notifications menu")).not.toHaveLength(0);
    });
});
