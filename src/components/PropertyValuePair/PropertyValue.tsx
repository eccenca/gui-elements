import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function PropertyValue({ className = "", children, ...otherProps }: any) {
    return (
        <dd className={`${eccgui}-propertyvalue__value` + (className ? " " + className : "")} {...otherProps}>
            <div>{children}</div>
        </dd>
    );
}

export default PropertyValue;
