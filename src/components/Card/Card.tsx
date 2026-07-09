import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

/** Historical Blueprint 0-4 elevation scale, kept for prop-shape compatibility. */
type CardElevation = 0 | 1 | 2 | 3 | 4;

// Maps the legacy Blueprint elevation scale onto Tailwind's box-shadow scale, see
// `src/_shadcn/ui/card.tsx` for the base recipe. Elevation `1` (the default) reads as a flat
// bordered shadcn card (`shadow-xs`); nothing climbs heavier than `shadow-lg`.
const elevationShadowClassName: Record<CardElevation, string> = {
    0: "shadow-none",
    1: "shadow-xs",
    2: "shadow-sm",
    3: "shadow-md",
    4: "shadow-lg",
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * `<Card />` element is included in DOM as simple `div` element.
     * By default it is a HTML `section`.
     */
    isOnlyLayout?: boolean;
    /**
     * Take the full height of container to display the card.
     */
    fullHeight?: boolean;
    /**
     * Background color is slightly altered to differ card display from other cards.
     */
    elevated?: boolean;
    /**
     * Controls the intensity of the drop shadow beneath the card.
     * At elevation `0`, no drop shadow is applied.
     * At elevation `-1`, the card is even borderless.
     */
    elevation?: -1 | CardElevation;
    /**
     * Whether the card should respond to user interactions, i.e. hovering increases the
     * drop shadow and the mouse cursor turns into a pointer.
     * Automatically enabled when an `onClick` handler is provided.
     */
    interactive?: boolean;
    /**
     * When card (or its children) get focus the card is scrolled into the viewport.
     * Property value defined which part of the card is always scrolled in, this may important when the card is larger than the viewport.
     */
    scrollinOnFocus?: "start" | "center" | "end";
    /**
     * Controls how much whitespace is displayed within the card subelements.
     */
    whitespaceAmount?: "none" | "small" | "medium" | "large";
}

/**
 * Element to separate content sections from each other.
 * Cards can include other cards but should not.
 */
export const Card = ({
    children,
    className = "",
    elevation = 1,
    isOnlyLayout = false,
    fullHeight = false,
    elevated = false,
    scrollinOnFocus,
    whitespaceAmount = "medium",
    interactive,
    ...otherProps
}: CardProps) => {
    const scrollIn = scrollinOnFocus
        ? {
              tabIndex: 0,
              onFocus: (e: any) => {
                  // FIXME: we should not have any hard relations to apps that using this lib
                  const el = e.target.closest(".diapp-iframewindow__content");
                  setTimeout(() => {
                      if (el)
                          el.scrollIntoView({
                              behavior: "smooth",
                              block: scrollinOnFocus,
                              inline: scrollinOnFocus,
                          });
                  }, 200);
              },
          }
        : {};

    // matches the original `interactive={otherProps.onClick ? true : interactive}` handed to Blueprint's Card
    const isInteractive = otherProps.onClick ? true : !!interactive;
    const nonNegativeElevation = Math.max(0, elevation) as CardElevation;

    const cardElement = (
        <div
            {...scrollIn}
            {...otherProps}
            className={cn(
                `${eccgui}-card`,
                // shadcn card recipe base (rounded-lg/border/bg/text), see `src/_shadcn/ui/card.tsx`;
                // outer flex column layout mirrors the original `display:flex; flex-flow:column nowrap;`
                "flex flex-col items-stretch justify-start rounded-lg bg-card text-card-foreground",
                elevation < 0
                    ? // "-1": even borderless, no drop shadow at all
                      `${eccgui}-card--whitespace-borderless border-none shadow-none`
                    : cn("border border-border", elevationShadowClassName[nonNegativeElevation]),
                isInteractive && "cursor-pointer transition-shadow hover:shadow-lg active:shadow-sm",
                // full workview height (the former `@extend` of Grid's fullheight rule); 1.75rem = 28px
                fullHeight && `${eccgui}-card--fullheight min-h-[calc(100vh-1.75rem)]`,
                elevated && `${eccgui}-card--elevated bg-muted`,
                scrollinOnFocus && `${eccgui}-card--scrollonfocus`,
                whitespaceAmount !== "medium" && `${eccgui}-card--whitespace-${whitespaceAmount}`,
                className,
            )}
        >
            {children}
        </div>
    );

    // FIXME: improve Card element so it is itself a section html element
    return isOnlyLayout === false ? <section>{cardElement}</section> : cardElement;
};

export default Card;
