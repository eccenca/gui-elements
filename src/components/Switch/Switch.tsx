import React, { memo } from "react";
import {
    Classes as BlueprintClasses,
    Switch as BlueprintSwitch,
    SwitchProps as BlueprintSwitchProps,
} from "@blueprintjs/core";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { Label } from "../Label/Label";

export interface SwitchProps extends Omit<BlueprintSwitchProps, "onChange"> {
    /**
     * Event handler for changed state.
     */
    onChange?: (value: boolean) => void;
    /**
     * class names
     */
    className?: string;
}

export const Switch = ({ onChange, className, label, ...otherProps }: SwitchProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(!!e.target?.checked);
        }
    };

    return (
        <BlueprintSwitch
            className={`${eccgui}-switch ${className ?? ""} ${
                label && !otherProps.labelElement ? BlueprintClasses.INLINE : ""
            }`}
            labelElement={
                label ? (
                    <Label text={label} isLayoutForElement="span" disabled={otherProps.disabled} inline />
                ) : undefined
            }
            {...otherProps}
            onChange={handleChange}
        />
    );
};

export default memo(Switch);
