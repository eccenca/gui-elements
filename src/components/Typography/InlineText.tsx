import React from "react";

import { TestableComponent } from "../interfaces";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface InlineTextProps extends React.HTMLAttributes<HTMLElement>, TestableComponent {
    /**
     * Additional CSS class name.
     */
    className?: string;
}

/**
 * Forces all children to be displayed as inline content.
 */
export const InlineText = ({
    className = "",
    children,
    ...otherProps
}: InlineTextProps) => {

    return (
        <div
            {...otherProps}
            className={
                `${eccgui}-typography__inlinetext` +
                (className ? " " + className : "")
            }
        >
            {children}
        </div>
    );
};

export default InlineText;
