import React, { CSSProperties } from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface StickyTargetProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Set the side the element need to be sticky on.
     */
    to?: "top" | "bottom";
    /**
     * The sticky area is positioned relatively to a local scroll area.
     * The application header is not taken into offset calculation
     */
    local?: boolean;
    /**
     * Set the background color used for the sticky area.
     * As it can overlay other content readability could be harmed if the overlayed content is shining through.
     */
    background?: "card" | "application" | "transparent";
    /**
     * Set additional distance to original sticky position.
     */
    offset?: `${number}${string}`;
}

/**
 * Element wraps the content that need to be displayed sticky.
 * The content then offset relative to its nearest scrolling ancestor and containing block (nearest block-level ancestor).
 */
export const StickyTarget = ({
    className,
    to = "top",
    local = false,
    background = "transparent",
    offset,
    style,
    ...otherDivProps
}: StickyTargetProps) => {
    let offsetStyle = {};
    if (typeof offset !== "undefined") {
        offsetStyle = { ...style, "--eccgui-sticky-target-localoffset": offset } as CSSProperties;
    }

    return (
        <div
            className={
                `${eccgui}-sticky__target` +
                (to ? ` ${eccgui}-sticky__target--${to}` : "") +
                (local ? ` ${eccgui}-sticky__target--localscrollarea` : "") +
                (background ? ` ${eccgui}-sticky__target--bg-${background}` : "") +
                (className ? ` ${className}` : "")
            }
            style={offset ? offsetStyle : style}
            {...otherDivProps}
        />
    );
};

export default StickyTarget;
