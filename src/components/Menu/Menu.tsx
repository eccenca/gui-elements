import React, { AriaRole } from "react";
import {
    Menu as BlueprintMenu,
    MenuItem as BlueprintMenuItem,
    MenuProps as BlueprintMenuProps,
} from "@blueprintjs/core";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import MenuDivider, { MenuDividerProps } from "./MenuDivider";
import MenuItem, { MenuItemProps } from "./MenuItem";

/**
 * Roles that are supported by the automatic `roleStructure` handling of the `MenuItem` children.
 */
type SupportedMenuRole = "menu" | "navigation" | "list" | "listbox" | "none" | "presentation";

export interface MenuProps extends BlueprintMenuProps {
    /**
     * Sets the ARIA role of the menu.
     * It may become mandatory in a future version.
     * Setting a `role` checks whether `MenuItem` and `MenuDivider` children use a correct `roleStructure`, or sets it automatically.
     * The automatic checks only work if `MenuItem` and `MenuDivider` are used as direct children or inside a `Fragment`.
     * The checks only work for `menu`, `navigation`, `list`, `listbox`, `none` and `presentation`.
     * Other roles are applied as they are, and the children are not processed.
     */
    role?: SupportedMenuRole | AriaRole;
}

const roleMapping: Partial<Record<SupportedMenuRole, AriaRole>> = {
    navigation: "list",
};

const allowedRoleStructure: Record<SupportedMenuRole, NonNullable<MenuItemProps["roleStructure"]>[]> = {
    menu: ["menuitem"],
    navigation: ["listitem"],
    list: ["listitem"],
    listbox: ["listoption"],
    none: ["none"],
    presentation: ["none"],
};

/**
 * Allowed values for an explicitly set `role` on `MenuItem` children, regarding their (explicitly or automatically set) `roleStructure`.
 * Blueprint sets this `role` on the inner target element of the item, where it overwrites the role defined by `roleStructure`,
 * so it must fit to the role of the `li` element that is defined by `roleStructure`.
 * A `roleStructure` without entry does not restrict the item role.
 */
const allowedItemRole: Partial<Record<NonNullable<MenuItemProps["roleStructure"]>, AriaRole[]>> = {
    menuitem: ["menuitem", "menuitemcheckbox", "menuitemradio"],
    listitem: ["link", "button", "none", "presentation"],
    // the `li` element already has the `option` role, so the target element must not have an own role
    listoption: ["none", "presentation"],
};

/**
 * `MenuDivider` children get this role if their `role="separator"` is not allowed inside the (mapped) menu role.
 */
const dividerRoleMapping: Partial<Record<AriaRole, AriaRole>> = {
    list: "listitem",
    listbox: "none",
};

/**
 * Blueprint uses this `roleStructure` by default, so it does not need to be set explicitly.
 */
const defaultRoleStructure: MenuItemProps["roleStructure"] = "menuitem";

/**
 * Represents a list of items, used as menu, navigation, options, or only for presentation.
 * It sets automatically `roleStructure` for its direct `MenuItem` children (also inside fragments) regarding the set `role`,
 * or it emits a console warning if it does not fit to an already set `roleStructure`.
 * It also emits a console warning if an explicitly set `role` of a `MenuItem` does not fit to its `roleStructure`.
 * On `MenuDivider` children without role or with `role="separator"` it sets `role="listitem"` in lists
 * (`role="list"` or `role="navigation"`) and `role="none"` in listboxes, because `separator` is not allowed there.
 * It also sets `aria-hidden` then if the divider has no `title` and no own `aria-hidden` value.
 * It does not add a `nav` wrapper on `role="navigation"`, you need to do it on your own.
 */
export const Menu = ({ children, className = "", role = "menu", ...restProps }: MenuProps) => {
    const isSupportedRole = Object.prototype.hasOwnProperty.call(allowedRoleStructure, role);
    const roleMapped = (isSupportedRole && roleMapping[role as SupportedMenuRole]) || role;
    const subroles = isSupportedRole ? allowedRoleStructure[role as SupportedMenuRole] : undefined;
    const dividerRole = Object.prototype.hasOwnProperty.call(dividerRoleMapping, roleMapped)
        ? dividerRoleMapping[roleMapped]
        : undefined;

    // warnings are collected while rendering and emitted by an effect, so they are not repeated on each re-render
    const warnings: string[] = [];

    const processItems = (
        nodes: React.ReactNode,
        subroles: NonNullable<MenuItemProps["roleStructure"]>[],
    ): React.ReactNode =>
        React.Children.map(nodes, (child) => {
            if (React.isValidElement<{ children?: React.ReactNode }>(child) && child.type === React.Fragment) {
                return <React.Fragment key={child.key}>{processItems(child.props.children, subroles)}</React.Fragment>;
            }
            if (React.isValidElement<MenuDividerProps>(child) && child.type === MenuDivider) {
                if (!dividerRole) {
                    return child;
                }
                const { role: ownRole, title, "aria-hidden": ariaHidden } = child.props;
                return React.cloneElement(child, {
                    // `separator` is not allowed here, other explicitly set roles are kept
                    ...(!ownRole || ownRole === "separator" ? { role: dividerRole } : {}),
                    ...(!title && ariaHidden === undefined ? { "aria-hidden": true } : {}),
                });
            }
            if (
                !React.isValidElement<MenuItemProps>(child) ||
                (child.type !== MenuItem && child.type !== BlueprintMenuItem)
            ) {
                return child;
            }
            const { roleStructure, role: itemRole } = child.props;
            const roleStructureUsed = roleStructure ?? subroles[0];
            const itemRoles = allowedItemRole[roleStructureUsed];
            if (itemRole && itemRoles && !itemRoles.includes(itemRole)) {
                warnings.push(
                    `Menu: MenuItem with role="${itemRole}" does not fit to its roleStructure="${roleStructureUsed}"${
                        roleStructure ? "" : ` (set automatically for Menu role="${role}")`
                    }, allowed: ${itemRoles.map((allowedRole) => `"${allowedRole}"`).join(", ")}.`,
                );
            }
            if (!roleStructure) {
                // prevent unnecessary cloning if Blueprint's default is used anyway
                return subroles[0] === defaultRoleStructure
                    ? child
                    : React.cloneElement(child, { roleStructure: subroles[0] });
            }
            if (!subroles.includes(roleStructure)) {
                warnings.push(
                    `Menu: MenuItem with roleStructure="${roleStructure}" does not fit into Menu with role="${role}", allowed: ${subroles
                        .map((subrole) => `"${subrole}"`)
                        .join(", ")}.`,
                );
            }
            return child;
        });

    const items = subroles ? processItems(children, subroles) : children;

    // only emit warnings again if they changed
    const warningsKey = warnings.join("\n");
    React.useEffect(() => {
        if (!warningsKey) {
            return;
        }
        warningsKey.split("\n").forEach((warning) => {
            // eslint-disable-next-line no-console
            console.warn(warning);
        });
    }, [warningsKey]);

    return (
        <BlueprintMenu role={roleMapped} {...restProps} className={`${eccgui}-menu__list ` + className}>
            {items}
        </BlueprintMenu>
    );
};

export default Menu;
