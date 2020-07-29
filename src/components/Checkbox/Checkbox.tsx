import React from 'react';
import { Checkbox as BlueprintCheckbox } from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function Checkbox({
    children,
    className='',
    ...restProps
}: any) {
    return (
        <BlueprintCheckbox
            {...restProps}
            className={`${eccgui}-checkbox ` + className}
        >
            {children}
        </BlueprintCheckbox>
    );
};

export default Checkbox;
