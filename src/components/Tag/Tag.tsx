import React from 'react';
import {
    Tag as BlueprintTag,
    ITagProps as IBlueprintTagPRops
} from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface TagProps extends Omit<
    IBlueprintTagPRops,
    // currently not supported
    "active" |
    "fill" |
    "large" |
    "multiline" |
    "intent" |
    "rightIcon" |
    "round"
> {
    // own properties

    /**
     * visual appearance and "thickness" of the tag
     */
    emphasis?: "stronger" | "strong" | "normal" | "weak" | "weaker";
    /**
     * display tag in a small version
     */
    small?: boolean;

    // deprecated

    /**
     * **deprecated**, use `minimal=false` plus `emphasis="stronger"`
     */
    emphasized?: never;
}

function Tag({
    children,
    className = '',
    emphasis = "normal",
    minimal = true,
    small = false,
    ...otherProps
}: TagProps) {
    otherProps['interactive'] = otherProps.interactive ?? !!otherProps.onClick ? true : false;
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
