import React from "react";
import { Menu as BlueprintMenu, MenuProps as BlueprintMenuProps } from "@blueprintjs/core";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export type MenuProps = BlueprintMenuProps;

export const Menu = ({ children, className = "", ...restProps }: MenuProps) => {
    return (
        <BlueprintMenu {...restProps} className={`${eccgui}-menu__list ` + className}>
            {children}
        </BlueprintMenu>
    );
};

export default Menu;
