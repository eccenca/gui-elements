import React from "react";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

export interface CardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Set an inverse direction of how the elements are aligned.
     * Mainly used for cards used as modals (dialogs).
     */
    inverseDirection?: boolean;
    /**
     * Set footer to display its children on only one line.
     */
    noWrap?: boolean;
}

/**
 * Contains a footer with user-interaction elements like buttons for the `Card` element.
 * Content must be ordered by importance, so the main action comes before other actions.
 */
export const CardActions = ({
    children,
    className = "",
    inverseDirection = false,
    noWrap = false,
    ...otherProps
}: CardActionsProps) => {
    return (
        <footer
            {...otherProps}
            data-inversedirection={inverseDirection ? "true" : undefined}
            data-nowrap={noWrap ? "true" : undefined}
            className={cn(
                `${eccgui}-card__actions`,
                // fixed-size flex item within Card's column layout; `gap-2` replaces the original's
                // first/last-child-excluding margin dance (simpler and wrap-safe);
                // hidden on print, mirroring the original `@media print { display: none }`.
                // `group/cardactions` + the data attributes above let `CardActionsAux` react to
                // `inverseDirection` / `noWrap` (see CardActionsAux.tsx).
                "group/cardactions flex shrink-0 grow-0 flex-row flex-wrap items-center gap-2 print:hidden",
                inverseDirection && `${eccgui}-card__actions--inversedirection flex-row-reverse`,
                noWrap && `${eccgui}-card__actions--nowrap flex-nowrap`,
                // medium (default) padding
                "px-4 py-3",
                // whitespaceAmount tiers cascade down from the ancestor `Card` root, which is the only
                // place that knows the value (see `Card.tsx`) - literal ancestor class names below are
                // required (not `${eccgui}-...` interpolation) so Tailwind's static scanner can see them.
                "[.eccgui-card--whitespace-none_&]:p-0",
                "[.eccgui-card--whitespace-small_&]:py-0.5 [.eccgui-card--whitespace-small_&]:px-2",
                "[.eccgui-card--whitespace-large_&]:py-3 [.eccgui-card--whitespace-large_&]:px-8",
                className,
            )}
        >
            {children}
        </footer>
    );
};

export default CardActions;
