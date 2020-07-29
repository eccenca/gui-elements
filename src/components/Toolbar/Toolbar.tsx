import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function Toolbar({ children, className = '', ...restProps }: any) {
    return (
        <div
            {...restProps}
            className={`${eccgui}-toolbar ` + className}
        >
            { children }
        </div>
    )
}

export default Toolbar;
