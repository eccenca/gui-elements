import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export type PropertyValueListProps = React.HTMLAttributes<HTMLDListElement>;

export const PropertyValueList = ({ className = "", children, ...otherProps }: PropertyValueListProps) => {
    return (
        <dl className={`${eccgui}-propertyvalue__list` + (className ? " " + className : "")} {...otherProps}>
            {children}
        </dl>
    );
};

export default PropertyValueList;
