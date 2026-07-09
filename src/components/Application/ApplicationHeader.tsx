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
                // 56px shell header (`h-14`), one z-layer below the modal layer (modals = 8001).
                // The background override hook survives as a static arbitrary value, falling back to
                // the shared `--sidebar` design token. When the header is elevated above open modals
                // (`useApplicationHeaderOverModals` adds `eccgui-application--topheader` on <body>) it
                // rises just above the modal layer (8002).
                "fixed inset-x-0 top-0 z-[8000] flex h-14 items-center border-b border-sidebar-border bg-[var(--eccgui-appheader-color-background,var(--sidebar))] text-sidebar-foreground",
                "[.eccgui-application--topheader_&]:z-[8002]",
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
