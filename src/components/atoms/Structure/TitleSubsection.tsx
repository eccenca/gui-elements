import React from "react";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

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
            // was `.__title-subsection` in _titles.scss: shadcn sidebar-label idiom — 12px medium
            // (`text-xs` carries the 16px line height), natural case, wide tracking, muted color.
            className: cn(
                `${eccgui}-structure__title-subsection`,
                "text-xs font-medium normal-case tracking-[0.5px] text-muted-foreground [&>*]:[font-size:inherit] [&>*]:[line-height:inherit]",
                className,
            ),
        },
        children,
    );
};

export default TitleSubsection;
