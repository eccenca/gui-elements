import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface PropertyValueProps extends React.HTMLAttributes<HTMLElement> {};

export const PropertyValue = ({ className = "", children, ...otherProps }: PropertyValueProps) => {
    return (
        <dd className={`${eccgui}-propertyvalue__value` + (className ? " " + className : "")} {...otherProps}>
            <div>{children}</div>
        </dd>
    );
}

export default PropertyValue;
