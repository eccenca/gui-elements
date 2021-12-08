import React from 'react';
import { MenuItem as BlueprintMenuItem } from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Icon from '../Icon/Icon';
import {IMenuItemProps} from "@blueprintjs/core/lib/esm/components/menu/menuItem";
import { openInNewTab } from '../../common/utils/openInNewTab';

interface IProps {
    children?: React.ReactNode | React.ReactNode[]
    className?: string
    icon?: string
    // Props defined by the Blueprint component that should be forwarded
    internalProps?: Partial<IMenuItemProps> & React.AnchorHTMLAttributes<HTMLAnchorElement>
    // FIXME: For backward compatibility, should be avoided in all code bases
    [key: string]: any
}

function MenuItem({
                      children,
                      className = '',
                      icon,
                      internalProps,
                      onClick, 
                      href,
                      ...restProps
                  }: IProps) {
    return (
        <BlueprintMenuItem
            {...internalProps}
            {...restProps}
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
