import React from "react";
import { OverlaysProvider } from "@blueprintjs/core";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export type ApplicationContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const ApplicationContainer = ({ children, className = "", ...otherDivProps }: ApplicationContainerProps) => {
    return (
        <OverlaysProvider>
            <div className={`${eccgui}-application__container ${className}`} {...otherDivProps}>
                {children}
            </div>
        </OverlaysProvider>
    );
};

export default ApplicationContainer;
