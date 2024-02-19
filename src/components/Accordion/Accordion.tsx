import React from "react";
import { Accordion as CarbonAccordion, AccordionProps as CarbonAccordionProps } from "carbon-components-react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface AccordionProps extends Omit<CarbonAccordionProps, "className" | "size"> {
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * How much space is used for the header of the each of the accordion items.
     */
    size?: "small" | "medium" | "large";
}

const carbonAccordionSizeMapping = {
    small: "sm" as const,
    medium: "md" as const,
    large: "lg" as const,
};

export const Accordion = ({
    children,
    className = "",
    align = "start",
    size = "medium",
    ...otherProps
}: AccordionProps) => {
    return (
        <CarbonAccordion
            className={`${eccgui}-accordion__container ` + className}
            align={align}
            size={carbonAccordionSizeMapping[size]}
            {...otherProps}
        >
            {children}
        </CarbonAccordion>
    );
};

export default Accordion;
