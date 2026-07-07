import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export type CardActionsAuxProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Additional side buttons inside `CardActions`.
 * Elements are aligned to the other side of the container.
 */
export const CardActionsAux = ({ children, className = "", ...otherProps }: CardActionsAuxProps) => {
    return (
        <div
            {...otherProps}
            className={cn(
                `${eccgui}-card__actions__aux`,
                // grows to consume the footer's remaining space, then right-aligns its own children within
                // it (left-aligns for `inverseDirection`, see `card.scss`); `order-[1000]` keeps it last
                // regardless of DOM position, mirroring the original unconditional `order: 1000`
                "flex grow flex-row flex-wrap items-center justify-end gap-1 order-[1000]",
                className,
            )}
        >
            {children}
        </div>
    );
};

export default CardActionsAux;
