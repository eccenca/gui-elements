import React from "react";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

export type TitlePageProps = React.HTMLAttributes<HTMLElement>;

export const TitlePage = ({ children, className = "", ...restProps }: TitlePageProps) => {
    let htmlElement = React.createElement("div");
    const childrenArray = React.Children.toArray(children);

    if (childrenArray.length === 1 && typeof childrenArray[0] === "string") {
        htmlElement = React.createElement("h1");
    }

    return (
        <htmlElement.type
            {...restProps}
            // was `.__title-page` in _titles.scss: 18px semibold, condensed em-relative tracking
            // (`text-lg` already carries the 28px line height); children inherit the title metrics.
            className={cn(
                `${eccgui}-structure__title-page`,
                "text-lg font-semibold tracking-[-0.01em] [&>*]:[font-size:inherit] [&>*]:[line-height:inherit]",
                className,
            )}
        >
            {children}
        </htmlElement.type>
    );
};

export default TitlePage;
