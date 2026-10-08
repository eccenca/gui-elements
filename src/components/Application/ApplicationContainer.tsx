import React from "react";
import { OverlaysProvider } from "@blueprintjs/core";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { useDropzoneMonitor } from "./helper";

export interface ApplicationContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * If set then the `element` is extended automatically by a `monitor-dropzone` data attribute.
     * This need to match with a `dropzone-for` data attribute on available dropzones for dragged elements.
     */
    monitorDropzonesFor?: string[];
    /**
     * Use a light or dark color palette for the GUI.
     * On `auto` it depends on the system configuration.
     */
    themeMode?: "dark" | "light" | "auto";
}

export const ApplicationContainer = ({
    children,
    className = "",
    monitorDropzonesFor = [],
    themeMode = "auto",
    ...otherDivProps
}: ApplicationContainerProps) => {
    const containerRef = React.useRef(null);
    useDropzoneMonitor(monitorDropzonesFor);

    return (
        <OverlaysProvider>
            <div
                ref={containerRef}
                className={
                    `${eccgui}-application__container ${eccgui}-palette--${themeMode}` +
                    (className ? ` ${className}` : "")
                }
                {...otherDivProps}
            >
                {children}
            </div>
        </OverlaysProvider>
    );
};

export default ApplicationContainer;
