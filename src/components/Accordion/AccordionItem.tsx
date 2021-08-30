import React from "react";
import _AccordionItem from "carbon-components-react/lib/components/AccordionItem";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

const CarbonAccordionItem = _AccordionItem;

export interface AccordionItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
    /*
        addional user class name
    */
    className?: string;
    /*
        content of accordion item
    */
    children: string | JSX.Element | JSX.Element[];
    /*
        disable accordion item
    */
    disabled?: boolean;
    /*
        set accordion item expliciteky as open when displayed first
    */
    open?: boolean;
    /*
        header of accordion item
    */
    label: string | JSX.Element;
    /*
        use full available width for content
    */
    fullWidth?: boolean;
    /*
        minimize white space and paddings
    */
    condensed?: boolean;
    /*
        do not use borders as visible separations on accordion item
    */
    noBorder?: boolean;
    /*
        highlight accordion item by different background color
    */
    elevated?: boolean;
    title?: never;
};

function AccordionItem({
    children,
    label,
    className = "",
    fullWidth = false,
    elevated = false,
    condensed = false,
    noBorder = false,
    ...otherProps
}: AccordionItemProps) {
    return (
        <CarbonAccordionItem
            className={
                `${eccgui}-accordion__item` +
                (!!className ? " " + className : "") +
                (fullWidth ? ` ${eccgui}-accordion__item--fullwidth` : "") +
                (elevated ? ` ${eccgui}-accordion__item--elevated` : "") +
                (condensed ? ` ${eccgui}-accordion__item--condensed` : "") +
                (noBorder ? ` ${eccgui}-accordion__item--noborder` : "")
            }
            title={label}
            {...otherProps}
        >
            {children}
        </CarbonAccordionItem>
    );
}

export default AccordionItem;
