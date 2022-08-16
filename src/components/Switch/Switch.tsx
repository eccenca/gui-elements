import React, {memo, SyntheticEvent} from 'react';
import { Switch as BlueprintSwitch, SwitchProps } from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface Props extends Omit<SwitchProps, "onChange"> {
    onChange?: (value: boolean) => any
}

function Switch({onChange, ...otherProps}: Props) {
    const handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
        const checked = !!(e as any).target?.checked
        onChange && onChange(checked);
    };

    return <BlueprintSwitch
        className={`${eccgui}-switch`}
        {...otherProps}
        onChange={handleChange}
    />
}

export default memo(Switch);
