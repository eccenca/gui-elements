import React from "react";

import { cn } from "../../common/utils/cn";
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
    className = "",
    canGrow = false,
    canShrink = false,
    hideOverflow = false,
    ...otherProps
}: ToolbarSectionProps) => {
    return (
        <div
            {...otherProps}
            className={cn(
                `${eccgui}-toolbar__section`,
                canGrow && `${eccgui}-toolbar__section--cangrow`,
                canShrink && `${eccgui}-toolbar__section--canshrink`,
                hideOverflow && `${eccgui}-toolbar__section--overflowhidden`,
                "flex flex-row flex-nowrap items-center min-w-0",
                canGrow ? "grow [&>*]:grow" : "grow-0",
                canShrink ? "shrink" : "shrink-0",
                // a `verticalStack` ancestor `Toolbar` (higher-specificity ancestor selector wins over the plain defaults above)
                // NOTE: literal class prefix — Tailwind's static extractor cannot resolve `${eccgui}` interpolation
                "[.eccgui-toolbar--vertical>&]:flex-col [.eccgui-toolbar--vertical>&]:items-stretch",
                hideOverflow && "overflow-hidden text-ellipsis",
                className,
            )}
        >
            {children}
        </div>
    );
};

export default ToolbarSection;
