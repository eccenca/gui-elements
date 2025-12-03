import React from "react";
import classNames from "classnames";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

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
        // eslint-disable-next-line no-console
        console.warn("`<ApplicationViewability/>` used with same media type for `hide` and `show`.");
        return children;
    }

    const enhancedClone = React.cloneElement(children, {
        className: classNames(children.props.className, {
            [`${eccgui}-application__hide--${hide}`]: hide,
            [`${eccgui}-application__show--${show}`]: show,
        }),
    });

    return enhancedClone;
};

export default ApplicationViewability;
