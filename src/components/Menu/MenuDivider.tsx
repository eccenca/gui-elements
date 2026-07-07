import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface MenuDividerProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "title"> {
    /**
     * If set, the divider is rendered as a titled section header instead of a plain separator line.
     */
    title?: React.ReactNode;
    /**
     * Alias for `title`, kept for API compatibility.
     */
    children?: React.ReactNode;
}

/**
 * Separator between `MenuItem`s. Without a `title` it renders a horizontal rule; with a `title`
 * (or children) it renders a non-interactive section header.
 */
export const MenuDivider = ({ children, title, className = "", ...restProps }: MenuDividerProps) => {
    const heading = title ?? children;

    if (heading != null && heading !== "") {
        return (
            <li
                {...restProps}
                className={cn(
                    `${eccgui}-menu__divider ${eccgui}-menu__header`,
                    "px-2 pb-1 pt-2 text-xs font-medium text-muted-foreground",
                    className,
                )}
            >
                {heading}
            </li>
        );
    }

    return (
        <li
            {...restProps}
            role="separator"
            className={cn(`${eccgui}-menu__divider`, "-mx-1 my-1 h-px bg-border", className)}
        />
    );
};

export default MenuDivider;
