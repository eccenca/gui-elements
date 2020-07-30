import React from "react";
import { AccordionItem as CarbonAccordionItem } from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface IAccordionItemProps {
    children?: JSX.Element | false | null | undefined;
    /**
        space-delimited list of class names
    */
    className?: string;
    /**
        title of accordion item
    */
    title: JSX.Element;
    /**
        reduce padding space of accordion item, default: false
    */
    fullWidth?: boolean;
    /**
        elevate accordion item visually, default: false
    */
    elevated?: boolean;
    /**
        limit vertical white space to condense content of accordion item, default: false
    */
    condensed?: boolean;
    /**
        remove border separations from accordion item, default: false
    */
    noBorder?: boolean;
    /**
        render accordion item in open state, default: false
    */
    open?: boolean;
    // allow other properties
    [otherProps: string]: any;
}

function AccordionItem({
    children,
    className = "",
    fullWidth = false,
    elevated = false,
    condensed = false,
    noBorder = false,
    ...otherProps
}: IAccordionItemProps) {
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
