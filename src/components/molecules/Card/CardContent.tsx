import React from "react";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Usually `CardContent` uses all the remaining space inside a card.
     * This behaviour can be changed by this option, so that the content section is not vertically grown or shrinked.
     * You may use this then you have multiple content sections in one card but not all those sections should be grown or shrinked regarding the remaining space.
     */
    noFlexHeight?: boolean;
}

/**
 * Holds the card content.
 * Display scrollbars in case there is not enough space for it.
 */
export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
    ({ children, className = "", noFlexHeight, ...otherProps }: CardContentProps, ref) => {
        return (
            <div
                {...otherProps}
                ref={ref}
                className={cn(
                    `${eccgui}-card__content`,
                    "overflow-auto",
                    noFlexHeight ? `shrink-0 grow-0 ${eccgui}-card__content--noflexheight` : "shrink grow",
                    // medium (default) padding; top is halved unless this is the first content area in the
                    // card (no header before it) - `first:` mirrors the original `&:first-child` rule. The
                    // "directly after a `<Divider />`" case (which is not `first:`) also keeps the halved
                    // `pt-2` (the canonical 8px body offset under a header rule).
                    "pt-2 px-4 pb-4 first:pt-4",
                    // whitespaceAmount tiers cascade down from the ancestor `Card` root, which is the only
                    // place that knows the value (see `Card.tsx`) - literal ancestor class names below are
                    // required (not `${eccgui}-...` interpolation) so Tailwind's static scanner can see them.
                    "[.eccgui-card--whitespace-none_&]:p-0",
                    "[.eccgui-card--whitespace-small_&]:pt-1 [.eccgui-card--whitespace-small_&]:px-2 [.eccgui-card--whitespace-small_&]:pb-2",
                    "[.eccgui-card--whitespace-small_&:first-child]:pt-2",
                    "[.eccgui-card--whitespace-large_&]:pt-4 [.eccgui-card--whitespace-large_&]:px-8 [.eccgui-card--whitespace-large_&]:pb-8",
                    "[.eccgui-card--whitespace-large_&:first-child]:pt-8",
                    className,
                )}
            >
                {children}
            </div>
        );
    },
);
