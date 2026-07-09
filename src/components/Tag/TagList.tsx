import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface TagListProps extends React.HTMLAttributes<HTMLUListElement> {
    label?: string;
}

function TagList({ children, className = "", label = "", ...otherProps }: TagListProps) {
    const tagList = (
        <ul
            className={cn(
                `${eccgui}-tag__list`,
                "inline-flex max-w-full flex-wrap items-center gap-1.5 p-0",
                className && !label ? className : ""
            )}
            {...otherProps}
        >
            {React.Children.map(children, (child, i) => {
                return child ? (
                    <li
                        className={cn(`${eccgui}-tag__list-item`, "inline-flex max-w-full items-center")}
                        key={"tagitem_" + i}
                    >
                        {child}
                    </li>
                ) : null;
            })}
        </ul>
    );

    if (label) {
        return (
            <div
                className={cn(
                    `${eccgui}-tag__list-wrapper`,
                    "inline-flex max-w-full flex-wrap items-baseline gap-2",
                    className ? className : ""
                )}
            >
                <strong className={cn(`${eccgui}-tag__list-label`, "whitespace-nowrap")}>{label}</strong>
                <span className={cn(`${eccgui}-tag__list-content`, "inline-flex max-w-full")}>{tagList}</span>
            </div>
        );
    }

    return tagList;
}

export default TagList;
