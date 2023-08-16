import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Label, { LabelProps } from "../Label/Label";

export interface PropertyNameProps extends React.HTMLAttributes<HTMLElement> {
    /**
     * Increase or decrease the width used for the property name.
     */
    size?: "small" | "medium" | "large";
    /**
     * Additonal label properties, e.g. `tooltip`.
     * It is only used if the `PropertyName` has simple text input.
     */
    labelProps?: LabelProps;
}

export const PropertyName = ({ className = "", size, children, labelProps, ...otherDtProps }: PropertyNameProps) => {
    return (
        <dt
            className={
                `${eccgui}-propertyvalue__property` +
                (size ? ` ${eccgui}-propertyvalue__property--${size}` : "") +
                (className ? " " + className : "")
            }
            {...otherDtProps}
        >
            <div>
                {typeof children === "string" ? (
                    <Label text={children} isLayoutForElement="span" {...labelProps} />
                ) : (
                    children
                )}
            </div>
        </dt>
    );
};

export default PropertyName;
