import React from 'react';
import { Radio as BlueprintRadioButton } from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function RadioButton({
    children,
    className='',
    ...restProps
}: any) {
    return (
        <BlueprintRadioButton
            {...restProps}
            className={`${eccgui}-radiobutton `+className}
        >
            {children}
        </BlueprintRadioButton>
    );
};

export default RadioButton;
