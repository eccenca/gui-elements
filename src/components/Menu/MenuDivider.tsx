import React from 'react';
import { MenuDivider as BlueprintMenuDivider } from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function MenuDivider({children, className='', ...restProps}: any) {
    return <BlueprintMenuDivider {...restProps} className={`${eccgui}-menu__divider ` + className}>{children}</BlueprintMenuDivider>;
}

export default MenuDivider;
