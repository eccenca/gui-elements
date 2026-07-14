import React from "react";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

export interface MenuProps extends React.HTMLAttributes<HTMLUListElement> {
    /**
     * Menu entries, usually `MenuItem` and `MenuDivider` elements.
     */
    children?: React.ReactNode;
    /**
     * Ref handler for the underlying `<ul>` element.
     */
    ulRef?: React.Ref<HTMLUListElement>;
}

/**
 * Styled list container for `MenuItem`/`MenuDivider` entries.
 *
 * Works both as a standalone list (e.g. as item renderer container inside `SuggestField`/`Select`
 * popovers) and as the content of a `ContextMenu` dropdown. It is purely a styled `<ul>`; the
 * interactive behaviour (keyboard navigation, dismissal) is provided by Radix when the menu is used
 * as dropdown content, and by the surrounding component in the standalone/static case.
 */
export const Menu = ({ children, className = "", ulRef, ...restProps }: MenuProps) => {
    return (
        <ul ref={ulRef} {...restProps} className={cn(`${eccgui}-menu__list`, "m-0 min-w-0 list-none p-0", className)}>
            {children}
        </ul>
    );
};

export default Menu;
