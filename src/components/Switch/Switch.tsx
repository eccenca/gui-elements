import React, { memo } from 'react';
import { Switch as BlueprintSwitch } from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function Switch({className, ...otherProps}:any) {
    const handleChange = (e) => {
        otherProps.onChange(e.target.checked)
    };

    return <BlueprintSwitch
        className={`${eccgui}-switch`}
        {...otherProps}
        onChange={handleChange}
    />
}

export default memo(Switch);
