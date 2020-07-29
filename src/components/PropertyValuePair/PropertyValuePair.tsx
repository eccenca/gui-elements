import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function PropertyValuePair({ className = "", children, hasSpacing = false, hasDivider = false, ...otherProps }: any) {
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
