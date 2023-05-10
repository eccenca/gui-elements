import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Label from "../Label/Label";

export interface PropertyNameProps extends React.HTMLAttributes<HTMLElement> {};

export const PropertyName = ({ className = "", children, ...otherProps }: PropertyNameProps) => {
    return (
        <dt className={`${eccgui}-propertyvalue__property` + (className ? " " + className : "")} {...otherProps}>
            <div>{typeof children === "string" ? <Label text={children} isLayoutForElement="span" /> : children}</div>
        </dt>
    );
}

export default PropertyName;
