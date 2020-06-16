import React from "react";
import { Accordion as CarbonAccordion } from "carbon-components-react";

interface IAccordionProps extends React.HTMLAttributes<HTMLUListElement> {
    /**
        space-delimited list of class names
    */
    className?: string;
    /**
        place of toggler, "start" (default) or "end"
    */
    align?: "start" | "end";
}

function Accordion({ children, className = "", align = "start", ...otherProps }: IAccordionProps) {
    return (
        <CarbonAccordion className={"ecc-accordion__container " + className} align={align} {...otherProps}>
            {children}
        </CarbonAccordion>
    );
}

export default Accordion;
