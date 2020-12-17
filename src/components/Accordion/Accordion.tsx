import React from "react";
import _Accordion from "carbon-components-react/lib/components/Accordion";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

const CarbonAccordion = _Accordion;

function Accordion({ children, className = "", align = "start", ...otherProps }: any) {
    return (
        <CarbonAccordion className={`${eccgui}-accordion__container ` + className} align={align} {...otherProps}>
            {children}
        </CarbonAccordion>
    );
}

export default Accordion;
