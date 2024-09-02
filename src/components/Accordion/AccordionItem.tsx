import React from "react";
import { AccordionItem as CarbonAccordionItem } from "@carbon/react";

// import { AccordionItemProps as CarbonAccordionItemProps } from "@carbon/react/es/components/Accordion/AccordionItem"; // TODO: check later again, currently interface is not exported
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

type sizeOptions = "none" | "small" | "medium" | "large";

// workaround to get type/interface
type CarbonAccordionItemProps = React.ComponentProps<typeof CarbonAccordionItem>;
export interface AccordionItemProps
    extends Omit<CarbonAccordionItemProps, "title" | "iconDescription" | "renderExpando"> {
    /**
     * additional user class name
     */
    className?: string;
    /**
     * header of accordion item
     */
    label: string | JSX.Element;
    /**
     * use full available width for content
     */
    fullWidth?: boolean;
    /**
     * Defines how much whitespace is used on top and bottom inside the header and content of an accordion item.
     * Seeting on `AccordionItem` overwrites the global setting on `Accordion`.
     */
    whitespaceSize?: sizeOptions | { header: sizeOptions; content: sizeOptions };
    /**
     * Defines how much space is used for the separation between the accordion item and the next one.
     */
    separationSize?: sizeOptions;
    /**
     * minimize white space and paddings
     * @deprecated Use `whitespaceSize="none"` on `Accordion` or `AccordionItem` instead.
     */
    condensed?: boolean;
    /**
     * do not use borders as visible separations on accordion item
     */
    noBorder?: boolean;
    /**
     * highlight accordion item by different background color
     */
    elevated?: boolean;
}

export const AccordionItem = ({
    children,
    label,
    className = "",
    fullWidth = false,
    elevated = false,
    whitespaceSize = "medium",
    separationSize = "none",
    condensed = false,
    noBorder = false,
    ...otherProps
}: AccordionItemProps) => {
    const headerWhitespaceSize = typeof whitespaceSize === "string" ? whitespaceSize : whitespaceSize.header;
    const contentWhitespaceSize = typeof whitespaceSize === "string" ? whitespaceSize : whitespaceSize.content;
    return (
        <CarbonAccordionItem
            className={
                `${eccgui}-accordion__item` +
                (className ? " " + className : "") +
                (fullWidth ? ` ${eccgui}-accordion__item--fullwidth` : "") +
                (elevated ? ` ${eccgui}-accordion__item--elevated` : "") +
                (headerWhitespaceSize !== "medium"
                    ? ` ${eccgui}-accordion__item--headerspace-${headerWhitespaceSize}`
                    : "") +
                (contentWhitespaceSize !== "medium"
                    ? ` ${eccgui}-accordion__item--contentspace-${contentWhitespaceSize}`
                    : "") +
                (separationSize !== "none" ? ` ${eccgui}-accordion__item--separationspace-${separationSize}` : "") +
                (condensed ? ` ${eccgui}-accordion__item--condensed` : "") +
                (noBorder ? ` ${eccgui}-accordion__item--noborder` : "")
            }
            title={label}
            {...otherProps}
        >
            {children}
        </CarbonAccordionItem>
    );
};

export default AccordionItem;
