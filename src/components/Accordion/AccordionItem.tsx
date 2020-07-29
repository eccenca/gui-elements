import React from "react";
import { AccordionItem as CarbonAccordionItem } from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function AccordionItem({
    children,
    className = "",
    fullWidth = false,
    elevated = false,
    condensed = false,
    noBorder = false,
    ...otherProps
}: any) {
    return (
        <CarbonAccordionItem
            className={
                `${eccgui}-accordion__item` +
                (className ? " " + className : "") +
                (fullWidth ? ` ${eccgui}-accordion__item--fullwidth` : "") +
                (elevated ? ` ${eccgui}-accordion__item--elevated` : "") +
                (condensed ? ` ${eccgui}-accordion__item--condensed` : "") +
                (noBorder ? ` ${eccgui}-accordion__item--noborder` : "")
            }
            {...otherProps}
        >
            {children}
        </CarbonAccordionItem>
    );
}

export default AccordionItem;
