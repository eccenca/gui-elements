import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function PropertyValueList({ className = "", children, ...otherProps }: any) {
    return (
        <dl className={`${eccgui}-propertyvalue__list` + (className ? " " + className : "")} {...otherProps}>
            {children}
        </dl>
    );
}

export default PropertyValueList;
