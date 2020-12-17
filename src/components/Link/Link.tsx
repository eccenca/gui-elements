import React from "react";
import _Link from "carbon-components-react/lib/components/Link";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

const CarbonLink = _Link;

function Link({ className = "", children, ...otherProps }: any) {
    return (
        <CarbonLink className={`${eccgui}-link ` + className} {...otherProps}>
            {children}
        </CarbonLink>
    );
}

export default Link;
