import React from 'react';
import {
    Checkbox as BlueprintCheckbox,
    CheckboxProps as BlueprintCheckboxProps
} from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface CheckboxProps extends BlueprintCheckboxProps {
    // currently we do not alter it
};

function Checkbox({
    children,
    className='',
    ...restProps
}: CheckboxProps) {
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
