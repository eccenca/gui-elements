import React from "react";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

export type TitleMainsectionProps = React.HTMLAttributes<HTMLElement>;

export const TitleMainsection = ({ children, className = "", ...restProps }: TitleMainsectionProps) => {
    let htmlElement = React.createElement("div");
    const childrenArray = React.Children.toArray(children);

    if (childrenArray.length === 1 && typeof childrenArray[0] === "string") {
        htmlElement = React.createElement("h2");
    }

    return (
        <htmlElement.type
            {...restProps}
            // was `.__title-mainsection` in _titles.scss: same modern recipe as the page title
            // (18px semibold, condensed em-relative tracking; `text-lg` carries the 28px line height).
            className={cn(
                `${eccgui}-structure__title-mainsection`,
                "text-lg font-semibold tracking-[-0.01em] [&>*]:[font-size:inherit] [&>*]:[line-height:inherit]",
                className,
            )}
        >
            {children}
        </htmlElement.type>
    );
};

export default TitleMainsection;
