import React from "react";
import {
    Menu as BlueprintMenu,
    MenuItem as BlueprintMenuItem,
    MenuProps as BlueprintMenuProps,
} from "@blueprintjs/core";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import MenuItem, { MenuItemProps } from "./MenuItem";

export interface MenuProps extends BlueprintMenuProps {
    /**
     * Sets a role according to an allowed subset of ARIA roles.
     * This will check if the `MenuItems` using a correct `roleStructure`,
     * or set it automatically.
     */
    role?: "menu" | "navigation" | "list" | "listbox" | "none" | "presentation";
}

type MenuRole = NonNullable<MenuProps["role"]>;

const roleMapping: Partial<Record<MenuRole, MenuRole>> = {
    navigation: "list",
};

const allowedSubroles: Record<MenuRole, NonNullable<MenuItemProps["roleStructure"]>[]> = {
    menu: ["menuitem"],
    navigation: ["listitem"],
    list: ["listitem"],
    listbox: ["listoption"],
    none: ["none"],
    presentation: ["none"],
};

/**
 * Represents a list of items, used as menu, navigation, options, or only for presentation.
 * It sets automatically `roleStructure` for its direct `MenuItem` children (also inside fragments) regarding the set `role`,
 * or it emits a console warning if it does not fit to an already set `roleStructure`.
 * It does not add a `nav` wrapper on `role="navigation"`, you need to do it on your own.
 */
export const Menu = ({ children, className = "", role = "menu", ...restProps }: MenuProps) => {
    const roleMapped = roleMapping[role] ?? role;
    const subroles = allowedSubroles[role];

    const processItems = (nodes: React.ReactNode): React.ReactNode =>
        React.Children.map(nodes, (child) => {
            if (React.isValidElement<{ children?: React.ReactNode }>(child) && child.type === React.Fragment) {
                return <React.Fragment key={child.key}>{processItems(child.props.children)}</React.Fragment>;
            }
            if (
                !React.isValidElement<MenuItemProps>(child) ||
                (child.type !== MenuItem && child.type !== BlueprintMenuItem)
            ) {
                return child;
            }
            const { roleStructure } = child.props;
            if (!roleStructure) {
                return React.cloneElement(child, { roleStructure: subroles[0] });
            }
            if (!subroles.includes(roleStructure)) {
                // eslint-disable-next-line no-console
                console.warn(
                    `Menu: MenuItem with roleStructure="${roleStructure}" does not fit into Menu with role="${role}", allowed: ${subroles
                        .map((subrole) => `"${subrole}"`)
                        .join(", ")}.`,
                );
            }
            return child;
        });

    return (
        <BlueprintMenu role={roleMapped} {...restProps} className={`${eccgui}-menu__list ` + className}>
            {processItems(children)}
        </BlueprintMenu>
    );
};

export default Menu;
