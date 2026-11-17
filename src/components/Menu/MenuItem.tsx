import React from "react";
import {
    Classes as BlueprintClasses,
    MenuItem as BlueprintMenuItem,
    MenuItemProps as BlueprintMenuItemProps,
} from "@blueprintjs/core";
import classNames from "classnames";

import { openInNewTab } from "../../common/utils/openInNewTab";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { ValidIconName } from "../Icon/canonicalIconNames";
import Icon from "../Icon/Icon";
import Tooltip from "../Tooltip/Tooltip";

import { TestIconProps } from "./../Icon/TestIcon";

export interface MenuItemProps
    extends
        Omit<BlueprintMenuItemProps, "icon" | "children" | "intent">,
        Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "onClick" | "onFocus" | "target" | "children"> {
    /**
     * If set the icon is displayed on the left side of the menu item.
     */
    icon?: ValidIconName | string[] | React.ReactElement<TestIconProps>;
    /**
     * Submenu.
     */
    children?: React.ReactNode;
    /**
     * Tooltip, but only added to the label, not to the full menu item.
     */
    tooltip?: string | React.JSX.Element;
    /**
     * Visual intent color to apply to element.
     */
    intent?: BlueprintMenuItemProps["intent"] | "accent";
    /**
     * Defines the ARIA role structure that is used for the menu item element and its inner target element.
     * It is recommended to set it, even if it is optional right now.
     * The value is checked if a `role` is set on the parent `Menu`.
     * It may become mandatory in a future version.
     */
    roleStructure?: BlueprintMenuItemProps["roleStructure"];
}

/**
 * Single item, used as child inside `Menu`.
 * It is recommended to use it as a direct child and not to wrap it inside other elements, except `Fragment`.
 */
export const MenuItem = React.forwardRef<HTMLLIElement, MenuItemProps>(
    ({ children, className = "", icon, onClick, href, text, tooltip, intent, ...restProps }, ref) => {
        return (
            <BlueprintMenuItem
                ref={ref}
                {...restProps}
                text={
                    tooltip ? (
                        <Tooltip content={tooltip} fill>
                            {text}
                        </Tooltip>
                    ) : (
                        text
                    )
                }
                href={href}
                onClick={(e: React.MouseEvent<HTMLElement>) =>
                    openInNewTab(e as React.MouseEvent<HTMLAnchorElement>, onClick, href)
                }
                className={classNames(`${eccgui}-menu__item`, className, {
                    // control blueprint intent classes to enhance it by new options
                    [`${BlueprintClasses.getClassNamespace()}-intent-${intent}`]: intent,
                })}
                icon={icon ? typeof icon === "string" || Array.isArray(icon) ? <Icon name={icon} /> : icon : false}
            >
                {children ?? null}
            </BlueprintMenuItem>
        );
    },
);

MenuItem.displayName = "MenuItem";

export default MenuItem;
