import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface OverviewItemActionsProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Display it only when the parent `OverviewItem` is hovered or focused.
     */
    hiddenInteractions?: boolean;
}

/**
 * Contains a unspecif number and types of elements for user-interactions.
 * It does not make sense to include more that 1 or 2 of those elements within `OverviewItem`.
 */
function OverviewItemActions ({
    children,
    className = '',
    hiddenInteractions = false,
    ...restProps
}: OverviewItemActionsProps) {
    return (
        <div
            {...restProps}
            className={
                `${eccgui}-overviewitem__actions` +
                (hiddenInteractions ? ` ${eccgui}-overviewitem__actions--hiddeninteractions ` : '') +
                (!!className ? ` ${className}` : '')
            }
        >
            {children}
        </div>
    )
}

export default OverviewItemActions;
