import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface OverviewItemActionsProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Display it only when the parent `OverviewItem` is hovered or focused.
     */
    hiddenInteractions?: boolean;
}

/**
 * Contains an arbitrary number of elements for user-interactions.
 * It does not make sense to include more than 1 or 2 of these elements within `OverviewItem`.
 */
export const OverviewItemActions = ({
    children,
    className = "",
    hiddenInteractions = false,
    ...restProps
}: OverviewItemActionsProps) => {
    const [showActions, setShowActions] = React.useState(!hiddenInteractions)

    React.useEffect(() => {
        // Delay rendering of item actions when they are hidden anyways, because rendering interaction elements like context menus currently has a large performance impact.
        setTimeout(() => setShowActions(true), 1)
    }, [])

    return (
        <div
            {...restProps}
            className={
                `${eccgui}-overviewitem__actions` +
                (hiddenInteractions ? ` ${eccgui}-overviewitem__actions--hiddeninteractions ` : "") +
                (className ? ` ${className}` : "")
            }
        >
            {showActions ? children : null}
        </div>
    );
};

export default OverviewItemActions;
