import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function ApplicationToolbarSection({ children, className = '', ...restProps }: any) {
    return (
        <div
            {...restProps}
            className={`${eccgui}-application__toolbar__section ` + className}
        >
            { children }
        </div>
    )
}

export default ApplicationToolbarSection;
