import React from "react";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

type media = "print" | "screen";

interface ApplicationViewabilityShow {
    /**
     * Show on media type.
     * If used, `hide` cannot be set.
     */
    show: media;
    hide?: never;
}

interface ApplicationViewabilityHide {
    /**
     * Hide on media type.
     * If used, `show` cannot be set.
     */
    hide: media;
    show?: never;
}

interface ApplicationViewabilityUndecided {
    /**
     * Only one child allowed.
     * Need to process the `className` property.
     */
    children: React.ReactElement<{ className?: string }>;
}

export type ApplicationViewabilityProps = ApplicationViewabilityUndecided &
    (ApplicationViewabilityShow | ApplicationViewabilityHide);

/**
 * Sets the viewability of the the contained element regarding media.
 * Can be used to hide elements, e.g. when the page is printed.
 */
export const ApplicationViewability = ({ children, show, hide }: ApplicationViewabilityProps) => {
    if (!show && !hide) {
        return children;
    }
    if (show === hide) {
        console.warn("`<ApplicationViewability/>` used with same media type for `hide` and `show`.");
        return children;
    }

    // Media display toggle, ported from `_viewability.scss` to arbitrary media variants:
    // hide-in-print / show-only-on-screen -> `[@media_print]:hidden`; the screen counterparts
    // (`[@media_screen]:hidden`) hide the element during normal (non-print) viewing.
    const mediaToggleClass =
        hide === "print"
            ? "[@media_print]:hidden!"
            : hide === "screen"
              ? "[@media_screen]:hidden!"
              : show === "print"
                ? "[@media_screen]:hidden!"
                : "[@media_print]:hidden!"; // show === "screen"

    const enhancedClone = React.cloneElement(children, {
        className: cn(children.props.className, mediaToggleClass, {
            [`${eccgui}-application__hide--${hide}`]: hide,
            [`${eccgui}-application__show--${show}`]: show,
        }),
    });

    return enhancedClone;
};

export default ApplicationViewability;
