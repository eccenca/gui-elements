import React from "react";
import { Accordion as CarbonAccordion, AccordionProps as CarbonAccordionProps } from "carbon-components-react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { AccordionItemProps } from "./AccordionItem";

export interface AccordionProps extends Omit<CarbonAccordionProps, "className" | "size"> {
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Defines how much whitespace is used on top and bottom inside the header and content of an accordion item.
     */
    whitespaceSize?: AccordionItemProps["whitespaceSize"];
    /**
     * How much space is used for the header of the each of the accordion items.
     * @deprecated Use ẁhitespaceSize` on `Accordion` or `AccordionItem` instead.
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
    whitespaceSize = "medium",
    size = "medium",
    ...otherProps
}: AccordionProps) => {
    const headerWhitespaceSize = typeof whitespaceSize === "string" ? whitespaceSize : whitespaceSize.header;
    const contentWhitespaceSize = typeof whitespaceSize === "string" ? whitespaceSize : whitespaceSize.content;
    return (
        <CarbonAccordion
            className={
                `${eccgui}-accordion__container` +
                (headerWhitespaceSize !== "medium"
                    ? ` ${eccgui}-accordion__container--global-headerspace-${headerWhitespaceSize}`
                    : "") +
                (contentWhitespaceSize !== "medium"
                    ? ` ${eccgui}-accordion__container--global-contentspace-${contentWhitespaceSize}`
                    : "") +
                (className ? ` ${className}` : "")
            }
            align={align}
            size={carbonAccordionSizeMapping[size]}
            {...otherProps}
        >
            {children}
        </CarbonAccordion>
    );
};

export default Accordion;
