import React from 'react';
import {
    MenuItem as BlueprintMenuItem,
    MenuItemProps as BlueprintMenuItemProps
} from "@blueprintjs/core";
import {CLASSPREFIX as eccgui} from "../../configuration/constants";
import Icon from '../Icon/Icon';
import { TestIconProps } from "./../Icon/TestIcon";
import { openInNewTab } from '../../common/utils/openInNewTab';
import { ValidIconName } from "../Icon/canonicalIconNames";

export interface MenuItemProps extends Omit<BlueprintMenuItemProps, "icon" | "children">, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "onClick" | "onFocus" | "target" | "children"> {
    /*
     * If set the icon is diplayed on the left side of the menu item.
     */
    icon?: ValidIconName | string[] | React.ReactElement<TestIconProps>;
    children?: React.ReactNode
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
    ...restProps
}: MenuItemProps) => {
    return (
        <BlueprintMenuItem
            {...restProps}
            href={href}
            onClick={(e:React.MouseEvent<HTMLElement>) => openInNewTab(e as React.MouseEvent<HTMLAnchorElement>, onClick, href)}
            className={`${eccgui}-menu__item ` + className}
            icon={
                icon ? (
                    (typeof icon === "string" || Array.isArray(icon)) ? (
                        <Icon name={icon} />
                    ) : (
                        icon
                    )
                ) : false
            }
        >
            {children ?? null}
        </BlueprintMenuItem>
    );
}

export default MenuItem;
