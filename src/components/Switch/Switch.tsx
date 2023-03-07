import React, {memo, SyntheticEvent} from 'react';
import {
    Switch as BlueprintSwitch,
    SwitchProps as BlueprintSwitchProps,
} from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface SwitchProps extends Omit<BlueprintSwitchProps, "onChange"> {
    /**
     * Event handler for changed state.
     */
    onChange?: (value: boolean) => any
    /**
     * class names
     */
    className?: string;
}

function Switch({onChange, className, ...otherProps}: SwitchProps) {
    const handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
        const checked = !!(e as any).target?.checked
        onChange && onChange(checked);
    };

    return <BlueprintSwitch
        className={`${eccgui}-switch ${className}`}
        {...otherProps}
        onChange={handleChange}
    />
}

export default memo(Switch);
