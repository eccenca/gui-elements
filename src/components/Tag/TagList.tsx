import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface TagListProps extends React.HTMLAttributes<HTMLUListElement> {
    label?: string;
}

function TagList({ children, className = "", label = "", ...otherProps }: TagListProps) {
    const tagList = (
        <ul className={`${eccgui}-tag__list` + (className && !label ? " " + className : "")} {...otherProps}>
            {React.Children.map(children, (child, i) => {
                return child ? (
                    <li className={`${eccgui}-tag__list-item`} key={"tagitem_" + i}>
                        {child}
                    </li>
                ) : null;
            })}
        </ul>
    );

    if (label) {
        return (
            <div className={`${eccgui}-tag__list-wrapper` + (className ? " " + className : "")}>
                <strong className={`${eccgui}-tag__list-label`}>{label}</strong>
                <span className={`${eccgui}-tag__list-content`}>{tagList}</span>
            </div>
        );
    }

    return tagList;
}

export default TagList;
