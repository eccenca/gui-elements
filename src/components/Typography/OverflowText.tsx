import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface IProps {
    ellipsis?: "reverse" | "none"
    inline?: boolean
    passDown?: boolean
    className?: string
    useHtmlElement?: "p" | "div" | "span"
    [key: string]: any
}

/** Prevents text from overflowing. */
function OverflowText({
    className = "",
    children,
    ellipsis,
    inline = false,
    passDown = false,
    useHtmlElement,
    ...otherProps
}: IProps) {
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
}

export default OverflowText;
