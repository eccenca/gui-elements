import React from "react";
import { Radio as BlueprintRadioButton, RadioProps as BlueprintRadioProps } from "@blueprintjs/core";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export type RadioButtonProps = BlueprintRadioProps;

export const RadioButton = ({ children, className = "", ...restProps }: RadioButtonProps) => {
    return (
        <BlueprintRadioButton {...restProps} className={`${eccgui}-radiobutton ` + className}>
            {children}
        </BlueprintRadioButton>
    );
};

export default RadioButton;
