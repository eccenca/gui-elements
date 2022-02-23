import React from 'react';
import {MenuItem as BlueprintMenuItem, MenuItemProps} from "@blueprintjs/core";
import {CLASSPREFIX as eccgui} from "../../configuration/constants";
import Icon from '../Icon/Icon';
import {ValidIconName} from "../Icon/canonicalIconNames";
import { openInNewTab } from '../../common/utils/openInNewTab';

interface IProps {
    children?: React.ReactNode | React.ReactNode[]
    className?: string
    icon?: ValidIconName | string[]
    // Props defined by the Blueprint component that should be forwarded
    internalProps?: Partial<MenuItemProps> & React.AnchorHTMLAttributes<HTMLAnchorElement>
    // FIXME: For backward compatibility, should be avoided in all code bases
    [key: string]: any
}

/** A single item in a Menu. */
function MenuItem({
                      children,
                      className = '',
                      icon,
                      internalProps,
                      onClick,
                      href,
                      ...restProps
                  }: IProps) {
    const actualHref = internalProps?.href ?? href
    return (
        <BlueprintMenuItem
            {...internalProps}
            {...restProps}
            href={actualHref}
            onClick={(e) => openInNewTab(e, onClick, actualHref)}
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
