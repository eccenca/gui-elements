import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Label from "../Label/Label";

function PropertyName({ className = "", children, ...otherProps }: any) {
    return (
        <dt className={`${eccgui}-propertyvalue__property` + (className ? " " + className : "")} {...otherProps}>
            <div>{typeof children === "string" ? <Label text={children} isLayoutForElement="span" /> : children}</div>
        </dt>
    );
}

export default PropertyName;
