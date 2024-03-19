import React from "react";
import { MenuDivider as BlueprintMenuDivider, MenuDividerProps as BlueprintMenuDividerProps } from "@blueprintjs/core";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export type MenuDividerProps = BlueprintMenuDividerProps;

export const MenuDivider = ({ children, className = "", ...restProps }: MenuDividerProps) => {
    return (
        <BlueprintMenuDivider {...restProps} className={`${eccgui}-menu__divider ` + className}>
            {children}
        </BlueprintMenuDivider>
    );
};

export default MenuDivider;
