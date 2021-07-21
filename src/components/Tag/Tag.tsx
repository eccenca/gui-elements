import React from 'react';
import {
    Tag as BlueprintTag,
    ITagProps as IBlueprintTagPRops
} from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface TagProps extends IBlueprintTagPRops {
    emphasis?: "stronger" | "strong" | "normal" | "weak" | "weaker";
    small?: boolean;
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
    small = false,
    ...otherProps
}: TagProps) {
    return (
        <BlueprintTag
            {...otherProps}
            className={
                `${eccgui}-tag__item ${eccgui}-tag--${emphasis}emphasis` +
                (small ? ` ${eccgui}-tag--small` : '') +
                (className ? ' ' + className : '')
            }
            minimal={minimal}
        >
            {children}
        </BlueprintTag>
    );
};

export default Tag;
