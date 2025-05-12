import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface OverviewItemActionsProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Display it only when the parent `OverviewItem` is hovered or focused.
     */
    hiddenInteractions?: boolean;
    /**
     * Delay the rendering of the children by a time in milliseconds.
     * Could be used to prevent browser freezes for the initial `OverviewItem` rendering.
     */
    delayDisplayChildren?: number;
    /**
     * Display element while the rendering of the actual children is delayed.
     */
    delaySkeleton?: JSX.Element;
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
            className={
                `${eccgui}-overviewitem__actions` +
                (hiddenInteractions ? ` ${eccgui}-overviewitem__actions--hiddeninteractions ` : "") +
                (className ? ` ${className}` : "")
            }
        >
            {showActions ? children : delaySkeleton}
        </div>
    );
};

export default OverviewItemActions;
