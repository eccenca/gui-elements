import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface PropertyValuePairProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Add a bit white space to the bottom of the element.
     */
    hasSpacing?: boolean;
    /**
     * Add a horizontal rule to the bottom of the element.
     */
    hasDivider?: boolean;
};

export const PropertyValuePair = ({
    className = "",
    children,
    hasSpacing = false,
    hasDivider = false,
    ...otherProps
}: PropertyValuePairProps) => {
    return (
        <div
            className={
                `${eccgui}-propertyvalue__pair` +
                (className ? " " + className : "") +
                (hasSpacing ? ` ${eccgui}-propertyvalue__pair--hasspacing` : "") +
                (hasDivider ? ` ${eccgui}-propertyvalue__pair--hasdivider` : "")
            }
            {...otherProps}
        >
            {children}
        </div>
    );
}

export default PropertyValuePair;
