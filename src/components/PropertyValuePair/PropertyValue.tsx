import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import OverflowText from "../Typography/OverflowText";

export interface PropertyValueProps extends React.HTMLAttributes<HTMLElement> {
    /**
     * Force value to get displayed without line breaks.
     * This only works best if you use a string or inline element as content.
     * Otherwise you may need to take care yourself about it.
     */
    nowrap?: boolean;
}

export const PropertyValue = ({ children, className = "", nowrap, ...otherDdProps }: PropertyValueProps) => {
    return (
        <dd
            className={
                `${eccgui}-propertyvalue__value` +
                (nowrap ? ` ${eccgui}-propertyvalue__value--nowrap` : "") +
                (className ? " " + className : "")
            }
            {...otherDdProps}
        >
            <div>{nowrap ? <OverflowText passDown>{children}</OverflowText> : children}</div>
        </dd>
    );
};

export default PropertyValue;
