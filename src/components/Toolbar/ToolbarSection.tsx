import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface ToolbarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
    * Is allowed to allocate more space than necessary to show all children.
    */
    canGrow?: boolean;
    /**
    * Allow element to get shrinked if there is not enough space to show all content.
    * This only makes sense if it contains children that are elastic in its size.
    */
    canShrink?: boolean;
    /**
    * Hides content that overflows available space.
    */
    hideOverflow?: boolean;
}

/**
 * Provides element to group toolbar elements together.
 * It can be configured how dynamic it is displayed regarding provided space inside the `Toolbar` parent.
 */
export const ToolbarSection = ({
    children,
    className = '',
    canGrow = false,
    canShrink = false,
    hideOverflow = false,
    ...otherProps
}:ToolbarSectionProps) => {
    return (
        <div
            {...otherProps}
            className={
                `${eccgui}-toolbar__section` +
                (canGrow ? ` ${eccgui}-toolbar__section--cangrow` : '') +
                (canShrink ? ` ${eccgui}-toolbar__section--canshrink` : '') +
                (hideOverflow ? ` ${eccgui}-toolbar__section--overflowhidden` : '') +
                (className ? ' ' + className : '')
            }
        >
            { children }
        </div>
    )
}

export default ToolbarSection;
