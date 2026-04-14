import React from "react";
import { Radio as BlueprintRadioButton, RadioProps as BlueprintRadioProps } from "@blueprintjs/core";
import classNames from "classnames";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface RadioButtonProps extends BlueprintRadioProps {
    /**
     * Hide the indicator.
     * The element cannot be identified as radio input then but a click on the children can be easily processed via `onChange` event.
     */
    hideIndicator?: boolean;
}

export const RadioButton = ({ children, className = "", hideIndicator = false, ...restProps }: RadioButtonProps) => {
    return (
        <BlueprintRadioButton
            {...restProps}
            className={classNames(`${eccgui}-radiobutton`, className, {
                [`${eccgui}-radiobutton--hidden-indicator`]: hideIndicator,
            })}
        >
            {children}
        </BlueprintRadioButton>
    );
};

export default RadioButton;
