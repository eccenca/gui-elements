/*
 * Contract test for the Application shell: the public classnames (`eccgui-application__*`),
 * landmark roles and aria attributes are part of the frozen DOM contract (application
 * stylesheets and the dropzone monitoring select on them) and must be kept stable.
 */
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import {
    ApplicationContainer,
    ApplicationContent,
    ApplicationHeader,
    ApplicationSidebarNavigation,
    ApplicationSidebarToggler,
    ApplicationTitle,
    ApplicationToolbar,
    ApplicationToolbarAction,
    ApplicationToolbarPanel,
    ApplicationToolbarSection,
} from "../../../index";

describe("Application shell (smoke)", () => {
    it("renders the full composition with preserved classnames and landmarks", () => {
        const onToggle = jest.fn();
        const onAction = jest.fn();
        const onLeave = jest.fn();
        const { container } = render(
            <ApplicationContainer monitorDropzonesFor={["application/reactflow", "Files"]}>
                <ApplicationHeader aria-label="Test App">
                    <ApplicationTitle
                        href="/home"
                        prefix="corp"
                        depiction={<img src="logo.png" alt="logo" />}
                        isNotDisplayed={false}
                        isApplicationSidebarExpanded={true}
                    >
                        AppName
                    </ApplicationTitle>
                    <ApplicationSidebarToggler aria-label="Close navigation" onClick={onToggle} isActive={true} />
                    <ApplicationSidebarNavigation expanded={true} isRail={false}>
                        <span>menu</span>
                    </ApplicationSidebarNavigation>
                    <ApplicationToolbar>
                        <ApplicationToolbarSection>section</ApplicationToolbarSection>
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
                    </ApplicationToolbar>
                </ApplicationHeader>
                <ApplicationContent isApplicationSidebarExpanded={true} isApplicationSidebarRail={false}>
                    content
                </ApplicationContent>
            </ApplicationContainer>,
        );

        // container + landmarks
        expect(container.querySelector(".eccgui-application__container")).toBeInTheDocument();
        const header = container.querySelector("header.eccgui-application__header");
        expect(header).toBeInTheDocument();
        expect(header).toHaveAttribute("aria-label", "Test App");
        const nav = container.querySelector("nav.eccgui-application__menu__sidebar");
        expect(nav).toBeInTheDocument();
        expect(nav).toHaveAttribute("aria-label", "sidebar");
        expect(container.querySelector("main.eccgui-application__content")).toBeInTheDocument();
        expect(container.querySelector(".eccgui-application__content--withsidebar")).toBeInTheDocument();

        // title
        const title = container.querySelector("a.eccgui-application__title");
        expect(title).toHaveAttribute("href", "/home");
        expect(title!.className).toContain("eccgui-application__title--withsidebar");
        expect(container.querySelector(".eccgui-application__title--content")).toHaveTextContent("corp");
        expect(container.querySelector(".eccgui-application__title--depiction img")).toBeInTheDocument();

        // toggler
        const toggler = container.querySelector("button.eccgui-application__menu__toggler");
        expect(toggler).toHaveAttribute("title", "Close navigation");
        fireEvent.click(toggler!);
        expect(onToggle).toHaveBeenCalled();

        // toolbar + action + panel
        expect(container.querySelector(".eccgui-application__toolbar")).toBeInTheDocument();
        expect(container.querySelector(".eccgui-application__toolbar__section")).toBeInTheDocument();
        const action = container.querySelector("button#headerUserMenu");
        expect(action!.className).toContain("eccgui-application__toolbar__action");
        fireEvent.click(action!);
        expect(onAction).toHaveBeenCalled();
        expect(container.querySelector(".eccgui-application__toolbar__panel")).toHaveAttribute(
            "aria-label",
            "User menu",
        );
        expect(container.querySelector(".eccgui-application__toolbar__panel-backdrop--onleave")).toBeInTheDocument();

        // no Carbon classnames left anywhere
        expect(container.querySelectorAll("[class*='cds--']").length).toBe(0);
    });

    it("hides the title and renders the rail state when the sidebar is collapsed", () => {
        const { container } = render(
            <ApplicationHeader aria-label="Test App">
                <ApplicationTitle isNotDisplayed={true} isApplicationSidebarExpanded={false}>
                    AppName
                </ApplicationTitle>
                <ApplicationSidebarToggler aria-label="Open navigation" isActive={false} />
                <ApplicationSidebarNavigation expanded={false} isRail={true}>
                    <span>menu</span>
                </ApplicationSidebarNavigation>
            </ApplicationHeader>,
        );
        expect(container.querySelector(".eccgui-application__title--nodisplay")).toBeInTheDocument();
        const nav = container.querySelector(".eccgui-application__menu__sidebar");
        expect(nav!.className).toContain("eccgui-application__menu__sidebar--rail");
        expect(nav).toHaveAttribute("data-expanded", "false");
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
