import React from "react";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";
import OverflowText from "@/components/atoms/Typography/OverflowText";

export interface PropertyValueProps extends React.HTMLAttributes<HTMLElement> {
    /**
     * Force value to get displayed without line breaks.
     * This works best if you use a string or inline element as content.
     * Otherwise you may need to take care yourself about it.
     */
    nowrap?: boolean;
}

export const PropertyValue = ({ children, className = "", nowrap, ...otherDdProps }: PropertyValueProps) => {
    return (
        <dd
            className={cn(
                // vertically centered value cell; `min-w-0` lets long content truncate inside the grid
                // column. Between-value divider/spacing (for multi-value pairs) is applied by the parent
                // PropertyValuePair via `[&>dd:not(:last-child)]` (avoids underscore-in-classname selectors).
                "flex min-w-0 flex-col justify-center",
                // frozen `eccgui-*` classname contract
                `${eccgui}-propertyvalue__value`,
                nowrap && `${eccgui}-propertyvalue__value--nowrap`,
                className
            )}
            {...otherDdProps}
        >
            <div>{nowrap ? <OverflowText passDown>{children}</OverflowText> : children}</div>
        </dd>
    );
};

export default PropertyValue;
