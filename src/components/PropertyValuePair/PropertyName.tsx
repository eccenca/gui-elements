import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { IconProps } from "../Icon";
import { TestableComponent } from "../interfaces";
import Label, { LabelProps } from "../Label/Label";
import Spacing from "../Separation/Spacing";
import OverflowText from "../Typography/OverflowText";

export interface PropertyNameProps extends React.HTMLAttributes<HTMLElement>, TestableComponent {
    /**
     * Increase or decrease the width used for the property name.
     */
    size?: "small" | "medium" | "large";
    /**
     * Force label to get displayed without line breaks.
     * This works best if you use a simple string as content.
     * Otherwise you may need to take care yourself about it.
     */
    nowrap?: boolean;
    /**
     * Additional label properties, e.g. `tooltip`.
     * It is only used if the `PropertyName` has simple text input.
     */
    labelProps?: LabelProps;
    /**
     * Optional icon next to the name
     */
    rightIcon?: React.ReactElement<IconProps>;
}

export const PropertyName = ({
    children,
    className = "",
    size,
    nowrap,
    labelProps,
    rightIcon,
    ...otherDtProps
}: PropertyNameProps) => {
    return (
        <dt
            className={
                `${eccgui}-propertyvalue__property` +
                (size ? ` ${eccgui}-propertyvalue__property--${size}` : "") +
                (nowrap ? ` ${eccgui}-propertyvalue__property--nowrap` : "") +
                (className ? " " + className : "")
            }
            {...otherDtProps}
        >
            <div>
                {typeof children === "string" ? (
                    <Label
                        text={nowrap ? <OverflowText inline>{children}</OverflowText> : children}
                        isLayoutForElement="span"
                        {...labelProps}
                    />
                ) : (
                    children
                )}
                {rightIcon && (
                    <>
                        <Spacing vertical size="tiny" />
                        {rightIcon}
                    </>
                )}
            </div>
        </dt>
    );
};

export default PropertyName;
