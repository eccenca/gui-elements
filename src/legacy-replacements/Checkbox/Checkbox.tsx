import React from 'react';
import Checkbox from "../../components/Checkbox/Checkbox";

const extendedOnChangeBoolean = (onChangeFn: any, event: any) => {
    if (typeof onChangeFn === "function") {
        onChangeFn({
            event,
            name: event.target.name,
            value: event.target.checked,
            rawValue: event.target.value,
        });
    }
};

export function CheckboxReplacement ({
    children = null,
    checked = false,
    className = null,
    disabled = false,
    label = null,
    onChange,
    ...otherProps
}: any) {
    if (process.env.NODE_ENV === 'development') {
        const debugMsg = ["This checkbox element is a adhoc replacement for a legacy element. Usage is deprecated, please use a standard element (Checkbox)."];
        if (typeof otherProps.ripple !== "undefined") {
            debugMsg.push("Checkbox 'ripple' property is not supported on legacy replacement element.");
            delete otherProps.ripple;
        }
        if (typeof otherProps.hideLabel !== "undefined") {
            debugMsg.push("Checkbox 'hideLabel' property is not supported on legacy replacement element.");
            delete otherProps.hideLabel;
        }
        debugMsg.forEach(element => console.debug(element));
    }
    return (
        <Checkbox
            {...otherProps}
            className={className}
            disabled={disabled}
            checked={checked}
            onChange={extendedOnChangeBoolean.bind(null, onChange)}
        >
            {label}
            {children}
        </Checkbox>
    );
}
