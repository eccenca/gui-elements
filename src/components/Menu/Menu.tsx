import React from 'react';
import { Menu as BlueprintMenu } from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function Menu({children, className='', ...restProps}: any) {
    return <BlueprintMenu {...restProps} className={`${eccgui}-menu__list ` + className}>{children}</BlueprintMenu>;
}

export default Menu;
