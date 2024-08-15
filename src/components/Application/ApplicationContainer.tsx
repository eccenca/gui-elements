import React from "react";
import { OverlaysProvider } from "@blueprintjs/core";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { useDropzoneMonitor } from "./helper";

export type ApplicationContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const ApplicationContainer = ({ children, className = "", ...otherDivProps }: ApplicationContainerProps) => {
    const containerRef = React.useRef<any>(null);
    useDropzoneMonitor();

    return (
        <OverlaysProvider>
            <div ref={containerRef} className={`${eccgui}-application__container ${className}`} {...otherDivProps}>
                {children}
            </div>
        </OverlaysProvider>
    );
};

export default ApplicationContainer;
