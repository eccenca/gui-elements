import React, { ChangeEvent, memo } from "react";
import { Switch as BlueprintSwitch, SwitchProps as BlueprintSwitchProps } from "@blueprintjs/core";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

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

export const Switch = ({ onChange, className, ...otherProps }: SwitchProps) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const checked = !!e.target?.checked;
        if (onChange) {
            onChange(checked);
        }
    };

    return (
        <BlueprintSwitch className={`${eccgui}-switch ${className ?? ""}`} {...otherProps} onChange={handleChange} />
    );
};

export default memo(Switch);
