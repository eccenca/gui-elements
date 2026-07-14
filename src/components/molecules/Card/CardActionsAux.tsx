import React from "react";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

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
                // it; `order-[1000]` keeps it last regardless of DOM position (unconditional `order: 1000`)
                "order-[1000] flex grow flex-row flex-wrap items-center justify-end gap-1",
                // react to the ancestor `CardActions` props (group-data from CardActions): left-align for
                // `inverseDirection`; for `noWrap` become a strong-shrinking single line (self + children)
                "group-data-[inversedirection=true]/cardactions:justify-start",
                "group-data-[nowrap=true]/cardactions:min-w-0 group-data-[nowrap=true]/cardactions:shrink-[5] group-data-[nowrap=true]/cardactions:flex-nowrap",
                "group-data-[nowrap=true]/cardactions:[&>*]:min-w-0 group-data-[nowrap=true]/cardactions:[&>*]:shrink-[10]",
                className,
            )}
        >
            {children}
        </div>
    );
};

export default CardActionsAux;
