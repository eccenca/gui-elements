import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface OverviewItemActionsProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    hiddenInteractions?: boolean;
}

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
