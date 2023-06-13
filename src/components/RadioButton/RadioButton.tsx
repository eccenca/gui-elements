import React from 'react';
import {
    Radio as BlueprintRadioButton,
    RadioProps as BlueprintRadioProps,
} from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface RadioButtonProps extends BlueprintRadioProps {
    // currently we do not alter it
};

export const RadioButton = ({
    children,
    className='',
    ...restProps
}: RadioButtonProps) => {
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
