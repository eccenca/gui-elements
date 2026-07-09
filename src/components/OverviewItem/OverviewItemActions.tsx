import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface OverviewItemActionsProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Display it only when the parent `OverviewItem` is hovered or focused.
     */
    hiddenInteractions?: boolean;
    /**
     * Delay the rendering of the children by a time in milliseconds.
     * Could be used to prevent browser freezes for the initial `OverviewItem` rendering.
     * In general, it is better to fix the cause, i.e. action elements that are expensive to initialize/render should be
     * optimized or replaced etc. This workaround only prevents the browser from getting blocked completely and does NOT
     * solve the actual performance issue.
     */
    delayDisplayChildren?: number;
    /**
     * Display element while the rendering of the actual children is delayed.
     */
    delaySkeleton?: React.JSX.Element;
}

/**
 * Contains an arbitrary number of elements for user-interactions.
 * It does not make sense to include more than 1 or 2 of these elements within `OverviewItem`.
 */
export const OverviewItemActions = ({
    children,
    className = "",
    hiddenInteractions = false,
    delayDisplayChildren = 0,
    delaySkeleton = <></>,
    ...restProps
}: OverviewItemActionsProps) => {
    const [showActions, setShowActions] = React.useState(!(delayDisplayChildren > 0));

    React.useEffect(() => {
        // Delay rendering of item actions when they are hidden anyways, because rendering interaction elements like context menus currently has a large performance impact.
        if (!showActions && delayDisplayChildren > 0) {
            setTimeout(() => setShowActions(true), delayDisplayChildren);
        }
    }, []);

    return (
        <div
            {...restProps}
            className={cn(
                `${eccgui}-overviewitem__actions`,
                hiddenInteractions && `${eccgui}-overviewitem__actions--hiddeninteractions`,
                // spacing between depiction/description/actions siblings is handled by `gap-2` on the parent
                // OverviewItem; `gap-1` here separates the individual action elements themselves (this
                // container commonly holds a cluster of icon-only buttons, e.g. `CardOptions`,
                // `ActivityControlWidget`'s action row).
                "flex-none flex-row flex-nowrap items-center justify-end gap-1 print:hidden",
                // hidden by default, revealed when the parent OverviewItem (`group/overviewitem`) is hovered/focused/active,
                // when this element itself has a focused descendant or an open `ContextOverlay`
                // (`eccgui-contextoverlay--open`, e.g. an open ContextMenu/overlay action), or when a
                // `VisualTour` highlights an element inside it (`eccgui-visual-tour__highlighted-element`,
                // added via `classList.add` by `VisualTour.tsx`). The `__` is escaped as `\_\_` because
                // Tailwind's arbitrary-variant parser otherwise turns `_` into a space.
                hiddenInteractions
                    ? "hidden has-[.eccgui-contextoverlay--open]:flex has-[.eccgui-visual-tour\\_\\_highlighted-element]:flex focus-within:flex group-hover/overviewitem:flex group-focus/overviewitem:flex group-active/overviewitem:flex"
                    : "flex",
                className,
            )}
        >
            {showActions ? children : delaySkeleton}
        </div>
    );
};

export default OverviewItemActions;
