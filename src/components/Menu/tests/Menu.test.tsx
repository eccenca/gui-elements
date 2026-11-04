import React from "react";
import { Classes as BlueprintClasses, MenuItem as BlueprintMenuItem } from "@blueprintjs/core";
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

        it.each(["group", "tree", "toString"])(
            "should render unsupported role '%s' as it is without processing the children",
            (role) => {
                const { container } = render(
                    <Menu role={role}>
                        <MenuItem text="item" roleStructure="listoption" />
                        <MenuItem text="item" />
                        <MenuDivider />
                    </Menu>,
                );
                const list = container.querySelector(`.${eccgui}-menu__list`);
                expect(list).toHaveAttribute("role", role);
                // children keep their own or Blueprint's default `roleStructure`
                expect(getDomRoles(container)).toEqual([expectedDomRoles.listoption, expectedDomRoles.menuitem]);
                expect(container.querySelector(`.${eccgui}-menu__divider`)).toHaveAttribute("role", "separator");
                expect(warnSpy).not.toHaveBeenCalled();
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

        it("should not clone MenuItems if Blueprint's default roleStructure 'menuitem' is used anyway", () => {
            const cloneSpy = jest.spyOn(React, "cloneElement");
            try {
                const { container } = render(
                    <Menu role="menu">
                        <MenuItem text="item 1" />
                        <MenuItem text="item 2" />
                    </Menu>,
                );
                expect(getDomRoles(container)).toEqual([expectedDomRoles.menuitem, expectedDomRoles.menuitem]);
                expect(cloneSpy).not.toHaveBeenCalled();
            } finally {
                cloneSpy.mockRestore();
            }
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

    describe("MenuDivider", () => {
        const getDividers = (container: HTMLElement) =>
            Array.from(container.querySelectorAll(`.${eccgui}-menu__divider`));

        it.each<MenuRole>(["list", "navigation"])(
            "should set role 'listitem' and aria-hidden on divider without title for role '%s'",
            (role) => {
                const { container } = render(
                    <Menu role={role}>
                        <MenuItem text="item 1" />
                        <MenuDivider />
                        <MenuItem text="item 2" />
                    </Menu>,
                );
                const [divider] = getDividers(container);
                expect(divider.tagName).toBe("LI");
                expect(divider).toHaveAttribute("role", "listitem");
                expect(divider).toHaveAttribute("aria-hidden", "true");
                expect(divider).toHaveClass(BlueprintClasses.MENU_DIVIDER);
            },
        );

        it.each<MenuRole>(["list", "navigation"])(
            "should set role 'listitem' but no aria-hidden on divider with title for role '%s'",
            (role) => {
                const { container } = render(
                    <Menu role={role}>
                        <MenuItem text="item 1" />
                        <MenuDivider title="Section" titleId="section-title" />
                        <MenuItem text="item 2" />
                    </Menu>,
                );
                const [divider] = getDividers(container);
                expect(divider).toHaveAttribute("role", "listitem");
                expect(divider).not.toHaveAttribute("aria-hidden");
                expect(divider).toHaveClass(BlueprintClasses.MENU_HEADER);
                expect(divider.querySelector("h6")).toHaveTextContent("Section");
                expect(divider.querySelector("h6")).toHaveAttribute("id", "section-title");
            },
        );

        it("should set role 'listitem' also on dividers inside fragments", () => {
            const { container } = render(
                <Menu role="list">
                    <>
                        <MenuItem text="item 1" />
                        <MenuDivider />
                        <MenuItem text="item 2" />
                    </>
                </Menu>,
            );
            const [divider] = getDividers(container);
            expect(divider).toHaveAttribute("role", "listitem");
            expect(divider).toHaveAttribute("aria-hidden", "true");
        });

        it("should overwrite an explicit separator role in lists", () => {
            const { container } = render(
                <Menu role="list">
                    <MenuDivider role="separator" />
                </Menu>,
            );
            expect(getDividers(container)[0]).toHaveAttribute("role", "listitem");
        });

        it("should keep other explicitly set roles in lists", () => {
            const { container } = render(
                <Menu role="list">
                    <MenuDivider role="presentation" />
                </Menu>,
            );
            expect(getDividers(container)[0]).toHaveAttribute("role", "presentation");
        });

        it("should keep an explicitly set aria-hidden value in lists", () => {
            const { container } = render(
                <Menu role="list">
                    <MenuDivider aria-hidden={false} />
                    <MenuDivider title="Section" aria-hidden={true} />
                </Menu>,
            );
            const [withoutTitle, withTitle] = getDividers(container);
            expect(withoutTitle).toHaveAttribute("aria-hidden", "false");
            expect(withoutTitle).toHaveAttribute("role", "listitem");
            expect(withTitle).toHaveAttribute("aria-hidden", "true");
        });

        it("should set role 'none' and aria-hidden on divider without title for role 'listbox'", () => {
            const { container } = render(
                <Menu role="listbox">
                    <MenuItem text="item 1" />
                    <MenuDivider />
                    <MenuDivider role="separator" />
                    <MenuDivider title="Section" />
                    <MenuItem text="item 2" />
                </Menu>,
            );
            const [withoutRole, withSeparator, withTitle] = getDividers(container);
            expect(withoutRole).toHaveAttribute("role", "none");
            expect(withoutRole).toHaveAttribute("aria-hidden", "true");
            expect(withSeparator).toHaveAttribute("role", "none");
            expect(withSeparator).toHaveAttribute("aria-hidden", "true");
            expect(withTitle).toHaveAttribute("role", "none");
            expect(withTitle).not.toHaveAttribute("aria-hidden");
        });

        it("should keep explicitly set divider values for role 'listbox'", () => {
            const { container } = render(
                <Menu role="listbox">
                    <MenuDivider role="presentation" aria-hidden={false} />
                </Menu>,
            );
            const [divider] = getDividers(container);
            expect(divider).toHaveAttribute("role", "presentation");
            expect(divider).toHaveAttribute("aria-hidden", "false");
        });

        it.each<MenuRole>(["menu", "none", "presentation"])(
            "should keep role 'separator' on divider for role '%s'",
            (role) => {
                const { container } = render(
                    <Menu role={role}>
                        <MenuDivider />
                        <MenuDivider title="Section" />
                    </Menu>,
                );
                getDividers(container).forEach((divider) => {
                    expect(divider).toHaveAttribute("role", "separator");
                    expect(divider).not.toHaveAttribute("aria-hidden");
                });
            },
        );

        it("should render all children of the list as listitems", () => {
            const { container } = render(
                <Menu role="navigation">
                    <MenuItem text="item 1" />
                    <MenuDivider />
                    <MenuItem text="item 2" />
                    <MenuDivider title="Section" />
                    <MenuItem text="item 3" />
                </Menu>,
            );
            const list = container.querySelector(`.${eccgui}-menu__list`)!;
            Array.from(list.children).forEach((child) => {
                expect(child.tagName).toBe("LI");
                expect([null, "listitem"]).toContain(child.getAttribute("role"));
            });
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

        it("should not repeat warnings on re-render", () => {
            const { rerender } = render(
                <Menu role="menu" className="first">
                    <MenuItem text="item" roleStructure="listoption" />
                </Menu>,
            );
            rerender(
                <Menu role="menu" className="second">
                    <MenuItem text="item" roleStructure="listoption" />
                </Menu>,
            );
            rerender(
                <Menu role="menu" className="third">
                    <MenuItem text="item changed" roleStructure="listoption" />
                </Menu>,
            );
            expect(warnSpy).toHaveBeenCalledTimes(1);
        });

        it("should warn again if the mismatches changed", () => {
            const { rerender } = render(
                <Menu role="menu">
                    <MenuItem text="item" roleStructure="listoption" />
                </Menu>,
            );
            rerender(
                <Menu role="menu">
                    <MenuItem text="item" roleStructure="listitem" />
                </Menu>,
            );
            expect(warnSpy).toHaveBeenCalledTimes(2);
            expect(warnSpy.mock.calls[1][0]).toContain('roleStructure="listitem"');
        });

        it("should not warn after the mismatch was fixed", () => {
            const { rerender } = render(
                <Menu role="menu">
                    <MenuItem text="item" roleStructure="listoption" />
                </Menu>,
            );
            rerender(
                <Menu role="menu">
                    <MenuItem text="item" roleStructure="menuitem" />
                </Menu>,
            );
            rerender(
                <Menu role="menu">
                    <MenuItem text="item" />
                </Menu>,
            );
            expect(warnSpy).toHaveBeenCalledTimes(1);
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
