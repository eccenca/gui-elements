import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { TestableComponent } from "../interfaces";

export interface InlineTextProps extends React.HTMLAttributes<HTMLElement>, TestableComponent {
    /**
     * Additional CSS class name.
     */
    className?: string;
}

/**
 * Forces all children to be displayed as inline content.
 */
export const InlineText = ({ className = "", children, ...otherProps }: InlineTextProps) => {
    return (
        <div {...otherProps} className={cn(`${eccgui}-typography__inlinetext`, className)}>
            {children}
        </div>
    );
};

export default InlineText;
