import React from "react";
import { MenuItem as BlueprintMenuItem, MenuItemProps as BlueprintMenuItemProps } from "@blueprintjs/core";

import { openInNewTab } from "../../common/utils/openInNewTab";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { ValidIconName } from "../Icon/canonicalIconNames";
import Icon from "../Icon/Icon";
import Tooltip from "../Tooltip/Tooltip";

import { TestIconProps } from "./../Icon/TestIcon";

export interface MenuItemProps
    extends Omit<BlueprintMenuItemProps, "icon" | "children">,
        Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "onClick" | "onFocus" | "target" | "children"> {
    /*
     * If set the icon is diplayed on the left side of the menu item.
     */
    icon?: ValidIconName | string[] | React.ReactElement<TestIconProps>;
    /**
     * Submenu.
     */
    children?: React.ReactNode;
    /**
     * Tooltip, but only added to the label, not to the full menu item.
     */
    tooltip?: string | JSX.Element;
}

/**
 * Single item, used as child inside `Menu`.
 */
export const MenuItem = ({
    children,
    className = "",
    icon,
    onClick,
    href,
    text,
    tooltip,
    ...restProps
}: MenuItemProps) => {
    return (
        <BlueprintMenuItem
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
            className={`${eccgui}-menu__item ` + className}
            icon={icon ? typeof icon === "string" || Array.isArray(icon) ? <Icon name={icon} /> : icon : false}
        >
            {children ?? null}
        </BlueprintMenuItem>
    );
};

export default MenuItem;
