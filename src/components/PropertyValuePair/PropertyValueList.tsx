import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface PropertyValueListProps extends React.HTMLAttributes<HTMLDListElement> {};

export const PropertyValueList = ({ className = "", children, ...otherProps }: PropertyValueListProps) => {
    return (
        <dl className={`${eccgui}-propertyvalue__list` + (className ? " " + className : "")} {...otherProps}>
            {children}
        </dl>
    );
}

export default PropertyValueList;
