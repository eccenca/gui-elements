import React from 'react';
import {
    MenuDivider as BlueprintMenuDivider,
    MenuDividerProps as BlueprintMenuDividerProps,
} from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface MenuDividerProps extends BlueprintMenuDividerProps {
    // we do not add own changes here currently
}

function MenuDivider({
    children,
    className="",
    ...restProps
}: MenuDividerProps) {
    return (
        <BlueprintMenuDivider
            {...restProps}
            className={`${eccgui}-menu__divider ` + className}>
            {children}
        </BlueprintMenuDivider>
    );
}

export default MenuDivider;
