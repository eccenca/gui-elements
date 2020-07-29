import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function TitleSubsection({ children, className = "", useHtmlElement, ...restProps }: any) {
    const childrenArray = React.Children.toArray(children);
    const defaultHtmlElement = childrenArray.length === 1 && typeof childrenArray[0] === "string" ? "h3" : "div";
    const titleElement = useHtmlElement ? React.createElement(useHtmlElement) : React.createElement(defaultHtmlElement);

    return (
        <titleElement.type {...restProps} className={`${eccgui}-structure__title-subsection ` + className}>
            {children}
        </titleElement.type>
    );
}

export default TitleSubsection;
