import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Label from "../Label/Label";

export interface PropertyNameProps extends React.HTMLAttributes<HTMLElement> {
    /**
     * Increase or decrease the width used for the property name.
     */
    size?: "small" | "medium" | "large";
}

export const PropertyName = ({ className = "", size, children, ...otherProps }: PropertyNameProps) => {
    return (
        <dt
            className={
                `${eccgui}-propertyvalue__property` +
                (size ? ` ${eccgui}-propertyvalue__property--${size}` : "") +
                (className ? " " + className : "")
            }
            {...otherProps}
        >
            <div>{typeof children === "string" ? <Label text={children} isLayoutForElement="span" /> : children}</div>
        </dt>
    );
};

export default PropertyName;
