import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface ApplicationHeaderProps extends React.HTMLAttributes<HTMLElement> {
    /**
     * Accessible label of the header landmark.
     */
    "aria-label"?: string;
    /**
     * Id of an element that labels the header landmark.
     */
    "aria-labelledby"?: string;
}

/**
 * Application top bar, displayed as fixed banner landmark at the top of the viewport.
 *
 * The background color can be overwritten via the `--eccgui-appheader-color-background`
 * custom property (see `_header.scss`), by default the shared `--sidebar` design token is
 * used.
 */
export const ApplicationHeader = ({ children = "", className = "", ...otherHeaderProps }: ApplicationHeaderProps) => {
    return (
        <header
            className={cn(
                // z-index, height and background-color are managed in `_header.scss`
                "fixed inset-x-0 top-0 flex items-center border-b border-sidebar-border text-sidebar-foreground",
                `${eccgui}-application__header`,
                className,
            )}
            {...otherHeaderProps}
        >
            {children}
        </header>
    );
};

export default ApplicationHeader;
