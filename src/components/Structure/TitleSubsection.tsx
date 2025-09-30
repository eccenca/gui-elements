import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface TitleSubsectionProps extends React.HTMLAttributes<HTMLElement> {
    /**
     * HTML tag to use for element. As default element `h3` is used for a string as children, otherwise `div`.
     */
    useHtmlElement?: keyof React.JSX.IntrinsicElements;
}

export const TitleSubsection = ({ children, className = "", useHtmlElement, ...restProps }: TitleSubsectionProps) => {
    const childrenArray = React.Children.toArray(children);
    const defaultHtmlElement = childrenArray.length === 1 && typeof childrenArray[0] === "string" ? "h3" : "div";
    const titleElement = useHtmlElement ?? defaultHtmlElement;

    return React.createElement(
        titleElement,
        {
            ...restProps,
            className: `${eccgui}-structure__title-subsection ` + className,
        },
        children
    );
};

export default TitleSubsection;
