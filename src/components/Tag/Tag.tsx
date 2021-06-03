import React from 'react';
import {
    Tag as BlueprintTag,
    ITagProps as IBlueprintTagPRops
} from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface TagProps extends IBlueprintTagPRops {
    emphasis?: "stronger" | "strong" | "normal" | "weak" | "weaker";
    // currently not supported
    active?: never;
    fill?: never;
    large?: never;
    multiline?: never;
    intent?: never;
    rightIcon?: never;
    // deprecated
    emphasized?: never; // use minimal=false plus emphasis="stronger"
}

function Tag({
    children,
    className = '',
    emphasis = "normal",
    minimal = true,
    ...otherProps
}: TagProps) {
    return (
        <BlueprintTag
            {...otherProps}
            className={
                `${eccgui}-tag__item ${eccgui}-tag--${emphasis}emphasis` +
                (className ? ' ' + className : '')
            }
            minimal={minimal}
        >
            {children}
        </BlueprintTag>
    );
};

export default Tag;
