import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { TestableComponent } from "../../components/interfaces";

export interface OverflowTextProps extends React.HTMLAttributes<HTMLElement>, TestableComponent {
    /**
     * How is ellipsis used to cut text overflows.
     * Use `reverse`to use the ellipis on text start and display the end of the text.
     */
    ellipsis?: "add" | "reverse" | "none";
    /**
     * Display component as inline element.
     */
    inline?: boolean;
    /**
     * Using text overflow on all children elements.
     */
    passDown?: boolean;
    /**
     * Additional CSS class name.
     */
    className?: string;
    /**
     * HTML element that is used for the component.
     */
    useHtmlElement?: "p" | "div" | "span";
    /**
     * Used for all other necessary properties.
     * @deprecated (v25) we will allow only basic HTML element properties and testing IDs
     */
    [key: string]: any;
}

/** Prevents text from overflowing. */
export const OverflowText = ({
    className = "",
    children,
    ellipsis = "add",
    inline = false,
    passDown = false,
    useHtmlElement,
    ...otherProps
}: OverflowTextProps) => {
    const defaultHtmlElement = inline ? "span" : "div";
    const overflowtextElement = useHtmlElement
        ? React.createElement(useHtmlElement)
        : React.createElement(defaultHtmlElement);

    return (
        <overflowtextElement.type
            {...otherProps}
            className={
                `${eccgui}-typography__overflowtext` +
                (className ? " " + className : "") +
                (ellipsis && (ellipsis === "reverse" || ellipsis === "none")
                    ? ` ${eccgui}-typography__overflowtext--ellipsis-` + ellipsis
                    : "") +
                (inline ? ` ${eccgui}-typography__overflowtext--inline` : "") +
                (passDown ? ` ${eccgui}-typography__overflowtext--passdown` : "")
            }
        >
            {children}
        </overflowtextElement.type>
    );
};

export default OverflowText;
