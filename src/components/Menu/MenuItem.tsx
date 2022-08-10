import React from 'react';
import {MenuItem as BlueprintMenuItem, MenuItemProps as BlueprintMenuItemProps} from "@blueprintjs/core";
import {CLASSPREFIX as eccgui} from "../../configuration/constants";
import Icon from '../Icon/Icon';
import { openInNewTab } from '../../common/utils/openInNewTab';
import {ValidIconName} from "../Icon/canonicalIconNames";

export interface MenuItemProps extends Omit<BlueprintMenuItemProps, "icon">, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "onClick" | "target"> {
    /*
     * If set the icon is diplayed on the left side of the menu item.
     */
    icon?: ValidIconName | string[];
}

/** A single item in a Menu. */
function MenuItem({
                      children,
                      className = '',
                      icon,
                      onClick,
                      href,
                      ...restProps
                  }: MenuItemProps) {
    return (
        <BlueprintMenuItem
            {...restProps}
            href={href}
            onClick={(e) => openInNewTab(e, onClick, href)}
            className={`${eccgui}-menu__item ` + className}
            icon={
                icon ? <Icon name={icon} /> : false
            }
        >
            {children}
        </BlueprintMenuItem>
    );
}

export default MenuItem;
