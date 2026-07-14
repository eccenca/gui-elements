import React from "react";

import { CLASSPREFIX as eccgui } from "@/configuration/constants";

import { useDropzoneMonitor } from "./helper";

export interface ApplicationContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * If set then the `element` is extended automatically by a `monitor-dropzone` data attribute.
     * This need to match with a `dropzone-for` data attribute on available dropzones for dragged elements.
     */
    monitorDropzonesFor?: string[];
}

export const ApplicationContainer = ({
    children,
    className = "",
    monitorDropzonesFor = [],
    ...otherDivProps
}: ApplicationContainerProps) => {
    const containerRef = React.useRef<any>(null);
    useDropzoneMonitor(monitorDropzonesFor);

    return (
        <div ref={containerRef} className={`${eccgui}-application__container ${className}`} {...otherDivProps}>
            {children}
        </div>
    );
};

export default ApplicationContainer;
