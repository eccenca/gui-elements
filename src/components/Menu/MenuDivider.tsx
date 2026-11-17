import React from "react";
import {
    Classes as BlueprintClasses,
    H6 as BlueprintSeparatorTitle,
    MenuDividerProps as BlueprintMenuDividerProps,
} from "@blueprintjs/core";
import classNames from "classnames";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

/**
 * Properties of the Blueprint `MenuDivider` and all attributes of the `li` element.
 * Use `role="listitem"` if the parent `Menu` is a list, because `separator` is not allowed there.
 * `Menu` sets it automatically, and `aria-hidden` for dividers without `title`.
 */
export interface MenuDividerProps
    extends
        BlueprintMenuDividerProps,
        Omit<React.LiHTMLAttributes<HTMLLIElement>, "title" | "children" | "className"> {}

/**
 * Divider or section header inside `Menu`.
 * It uses the same markup and classes like the Blueprint `MenuDivider`, but supports other roles than `separator`.
 */
export const MenuDivider = ({ className, role = "separator", title, titleId, ...otherLiProps }: MenuDividerProps) => {
    return (
        <li
            {...otherLiProps}
            role={role}
            className={classNames(
                title ? BlueprintClasses.MENU_HEADER : BlueprintClasses.MENU_DIVIDER,
                `${eccgui}-menu__divider`,
                className,
            )}
        >
            {title && <BlueprintSeparatorTitle id={titleId}>{title}</BlueprintSeparatorTitle>}
        </li>
    );
};

export default MenuDivider;
