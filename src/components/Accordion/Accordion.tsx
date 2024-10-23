import React, { ReactNode } from "react";
import { Accordion as CarbonAccordion, AccordionProps as CarbonAccordionProps } from "@carbon/react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { AccordionItemProps } from "./AccordionItem";

export interface AccordionProps extends Omit<CarbonAccordionProps, "children" | "className" | "size" | "isFlush"> {
    children?: ReactNode;
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Defines how much whitespace is used on top and bottom inside the header and content of an accordion item.
     */
    whitespaceSize?: AccordionItemProps["whitespaceSize"];
    /**
     * Defines how much space is used for the separation between an accordion item and the next one.
     */
    separationSize?: AccordionItemProps["separationSize"];
}

export const Accordion = ({
    children,
    className = "",
    align = "start",
    whitespaceSize = "medium",
    separationSize = "none",
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
                (separationSize !== "none"
                    ? ` ${eccgui}-accordion__container--global-separationspace-${separationSize}`
                    : "") +
                (className ? ` ${className}` : "")
            }
            align={align}
            {...otherProps}
        >
            {children}
        </CarbonAccordion>
    );
};

export default Accordion;
