import React from "react";
import { MenuItem as BlueprintMenuItem } from "@blueprintjs/core";
import { render } from "@testing-library/react";

import "@testing-library/jest-dom";

import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import Menu, { MenuProps } from "../Menu";
import MenuDivider from "../MenuDivider";
import MenuItem, { MenuItemProps } from "../MenuItem";

type MenuRole = NonNullable<MenuProps["role"]>;
type RoleStructure = NonNullable<MenuItemProps["roleStructure"]>;

/**
 * Blueprint renders `roleStructure` as roles on the `li` and the inner target element.
 * Each `roleStructure` value results in an unique combination.
 */
const expectedDomRoles: Record<RoleStructure, { li: string | null; target: string | null }> = {
    menuitem: { li: "none", target: "menuitem" },
    listitem: { li: null, target: null },
    listoption: { li: "option", target: null },
    none: { li: "none", target: null },
};

const getDomRoles = (container: HTMLElement) =>
    Array.from(container.querySelectorAll(`.${eccgui}-menu__item`)).map((target) => ({
        li: target.closest("li")!.getAttribute("role"),
        target: target.getAttribute("role"),
    }));

describe("Menu", () => {
    let warnSpy: jest.SpyInstance;

    beforeEach(() => {
        warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
        warnSpy.mockRestore();
    });

    describe("role", () => {
        it("should use role 'menu' by default", () => {
            const { container } = render(
                <Menu>
                    <MenuItem text="item" />
                </Menu>,
            );
            const list = container.querySelector(`.${eccgui}-menu__list`);
            expect(list).toHaveAttribute("role", "menu");
        });

        it("should map role 'navigation' to 'list'", () => {
            const { container } = render(
                <Menu role="navigation">
                    <MenuItem text="item" />
                </Menu>,
            );
            const list = container.querySelector(`.${eccgui}-menu__list`);
            expect(list).toHaveAttribute("role", "list");
        });

        it.each<MenuRole>(["menu", "list", "listbox", "none", "presentation"])(
            "should keep role '%s' unchanged",
            (role) => {
                const { container } = render(
                    <Menu role={role}>
                        <MenuItem text="item" />
                    </Menu>,
                );
                const list = container.querySelector(`.${eccgui}-menu__list`);
                expect(list).toHaveAttribute("role", role);
            },
        );

        it("should keep custom class names", () => {
            const { container } = render(<Menu className="custom-class" />);
            const list = container.querySelector(`.${eccgui}-menu__list`);
            expect(list).toHaveClass("custom-class");
        });
    });

    describe("roleStructure autoset", () => {
        it.each<[MenuRole, RoleStructure]>([
            ["menu", "menuitem"],
            ["navigation", "listitem"],
            ["list", "listitem"],
            ["listbox", "listoption"],
            ["none", "none"],
            ["presentation", "none"],
        ])("should set roleStructure for role '%s' to '%s' if not set", (role, expectedRoleStructure) => {
            const { container } = render(
                <Menu role={role}>
                    <MenuItem text="item 1" />
                    <MenuItem text="item 2" />
                </Menu>,
            );
            expect(getDomRoles(container)).toEqual([
                expectedDomRoles[expectedRoleStructure],
                expectedDomRoles[expectedRoleStructure],
            ]);
            expect(warnSpy).not.toHaveBeenCalled();
        });

        it("should set roleStructure also for Blueprint MenuItem children", () => {
            const { container } = render(
                <Menu role="listbox">
                    <BlueprintMenuItem text="item" className={`${eccgui}-menu__item`} />
                </Menu>,
            );
            expect(getDomRoles(container)).toEqual([expectedDomRoles.listoption]);
        });

        it("should not overwrite an allowed roleStructure", () => {
            const { container } = render(
                <Menu role="list">
                    <MenuItem text="item" roleStructure="listitem" />
                </Menu>,
            );
            expect(getDomRoles(container)).toEqual([expectedDomRoles.listitem]);
            expect(warnSpy).not.toHaveBeenCalled();
        });

        it("should only set roleStructure on items without one", () => {
            const { container } = render(
                <Menu role="list">
                    <MenuItem text="item 1" roleStructure="listitem" />
                    <MenuItem text="item 2" />
                </Menu>,
            );
            expect(getDomRoles(container)).toEqual([expectedDomRoles.listitem, expectedDomRoles.listitem]);
            expect(warnSpy).not.toHaveBeenCalled();
        });

        it("should set roleStructure for MenuItems nested in fragments", () => {
            const { container } = render(
                <Menu role="listbox">
                    <>
                        <MenuItem text="item 1" />
                        <>
                            <MenuItem text="item 2" />
                        </>
                        {[<MenuItem key="a" text="item 3" />, <MenuItem key="b" text="item 4" />]}
                    </>
                </Menu>,
            );
            expect(getDomRoles(container)).toEqual(Array(4).fill(expectedDomRoles.listoption));
        });

        it("should leave other children untouched", () => {
            const { container } = render(
                <Menu role="list">
                    <MenuItem text="item 1" />
                    <MenuDivider />
                    <li className="custom-child">custom</li>
                    {"text"}
                    {null}
                </Menu>,
            );
            expect(getDomRoles(container)).toEqual([expectedDomRoles.listitem]);
            expect(container.querySelector(".custom-child")).toBeInTheDocument();
            expect(container).toHaveTextContent("text");
            expect(warnSpy).not.toHaveBeenCalled();
        });
    });

    describe("roleStructure check", () => {
        it.each<[MenuRole, RoleStructure]>([
            ["menu", "listitem"],
            ["menu", "listoption"],
            ["navigation", "menuitem"],
            ["list", "listoption"],
            ["listbox", "menuitem"],
            ["none", "listitem"],
            ["presentation", "menuitem"],
        ])("should warn for role '%s' with not allowed roleStructure '%s'", (role, roleStructure) => {
            render(
                <Menu role={role}>
                    <MenuItem text="item" roleStructure={roleStructure} />
                </Menu>,
            );
            expect(warnSpy).toHaveBeenCalledTimes(1);
            expect(warnSpy.mock.calls[0][0]).toContain(`roleStructure="${roleStructure}"`);
            expect(warnSpy.mock.calls[0][0]).toContain(`role="${role}"`);
        });

        it("should keep the not allowed roleStructure value", () => {
            const { container } = render(
                <Menu role="menu">
                    <MenuItem text="item" roleStructure="listoption" />
                </Menu>,
            );
            expect(getDomRoles(container)).toEqual([expectedDomRoles.listoption]);
        });

        it("should list the allowed values in the warning", () => {
            render(
                <Menu role="listbox">
                    <MenuItem text="item" roleStructure="menuitem" />
                </Menu>,
            );
            expect(warnSpy.mock.calls[0][0]).toContain('allowed: "listoption"');
        });

        it("should warn once per not allowed item", () => {
            render(
                <Menu role="menu">
                    <MenuItem text="item 1" roleStructure="listitem" />
                    <MenuItem text="item 2" roleStructure="menuitem" />
                    <MenuItem text="item 3" roleStructure="none" />
                    <MenuItem text="item 4" />
                </Menu>,
            );
            expect(warnSpy).toHaveBeenCalledTimes(2);
        });

        it("should check Blueprint MenuItem children too", () => {
            render(
                <Menu role="menu">
                    <BlueprintMenuItem text="item" roleStructure="listoption" />
                </Menu>,
            );
            expect(warnSpy).toHaveBeenCalledTimes(1);
        });

        it("should check MenuItems nested in fragments", () => {
            render(
                <Menu role="menu">
                    <>
                        <MenuItem text="item" roleStructure="listoption" />
                        <>
                            <MenuItem text="item" roleStructure="listitem" />
                        </>
                    </>
                </Menu>,
            );
            expect(warnSpy).toHaveBeenCalledTimes(2);
        });

        it("should not check MenuItems in submenus", () => {
            render(
                <Menu role="list">
                    <MenuItem text="parent" roleStructure="listitem">
                        <MenuItem text="sub item" roleStructure="menuitem" />
                    </MenuItem>
                </Menu>,
            );
            expect(warnSpy).not.toHaveBeenCalled();
        });
    });
});
