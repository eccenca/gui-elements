import React from 'react';
import RadioButton from "../../components/RadioButton/RadioButton";

export function RadioButtonReplacement ({
    children,
    label,
    ...otherProps
}: any) {
    if (process.env.NODE_ENV === 'development') {
        const debugMsg = ["This radio element is a adhoc replacement for a legacy element. Usage is deprecated, please use a standard element (RadioButton)."];
        if (typeof otherProps.ripple !== "undefined") {
            debugMsg.push("Radio 'ripple' property is not supported on legacy replacement element.");
            delete otherProps.ripple;
        }
        if (typeof otherProps.hideLabel !== "undefined") {
            debugMsg.push("Radio 'hideLabel' property is not supported on legacy replacement element.");
            delete otherProps.hideLabel;
        }
        if (typeof label !== "undefined") {
            debugMsg.push("Radio 'label' property is not supported exactly like at the legacy element.");
        }
        debugMsg.forEach(element => console.debug(element));
    }
    return (
        <RadioButton
            {...otherProps}
        >
            {label}
            {children}
        </RadioButton>
    );
}
