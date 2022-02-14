import React from "react";
import {Link as CarbonLink} from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function Link({ className = "", children, ...otherProps }: any) {
    return (
        <CarbonLink className={`${eccgui}-link ` + className} {...otherProps}>
            {children}
        </CarbonLink>
    );
}

export default Link;
