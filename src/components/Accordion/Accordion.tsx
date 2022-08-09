import React from "react";
import {Accordion as CarbonAccordion} from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
function Accordion({ children, disabled, className = "", align = "start", ...otherProps }: any) {
   
    return (
        <CarbonAccordion className={`${eccgui}-accordion__container ` + className} align={align} {...otherProps}>
            {children}
        </CarbonAccordion>
    );
}

export default Accordion;
