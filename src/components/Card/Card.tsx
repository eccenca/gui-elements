import React from "react";
import {
    Card as BlueprintCard,
    CardProps as BlueprintCardProps,
    Elevation as BlueprintCardElevation,
} from "@blueprintjs/core";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface CardProps extends Omit<BlueprintCardProps, "elevation"> {
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
    elevation?: -1 | BlueprintCardElevation;
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
    const cardElement = (
        <BlueprintCard
            className={
                `${eccgui}-card` +
                (fullHeight ? ` ${eccgui}-card--fullheight` : "") +
                (elevated ? ` ${eccgui}-card--elevated` : "") +
                (scrollinOnFocus ? ` ${eccgui}-card--scrollonfocus` : "") +
                (whitespaceAmount !== "medium" ? ` ${eccgui}-card--whitespace-${whitespaceAmount}` : "") +
                (elevation < 0 ? ` ${eccgui}-card--whitespace-borderless` : "") +
                (className ? ` ${className}` : "")
            }
            elevation={Math.max(0, elevation) as BlueprintCardElevation}
            interactive={otherProps.onClick ? true : interactive}
            {...scrollIn}
            {...otherProps}
        >
            {children}
        </BlueprintCard>
    );

    // FIXME: improve Card element so it is itself a section html element
    return isOnlyLayout === false ? <section>{cardElement}</section> : cardElement;
};

export default Card;
