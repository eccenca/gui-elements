import React from "react";
import { OverlaysProvider } from "@blueprintjs/core";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import {useGlobalAppDragMonitor} from "./helper";

export type ApplicationContainerProps = React.HTMLAttributes<HTMLDivElement>;
export const APPLICATION_CONTAINER_ID = "gui-elements-application-container"

export const ApplicationContainer = ({ children, className = "", ...otherDivProps }: ApplicationContainerProps) => {
    useGlobalAppDragMonitor()

    return (
        <OverlaysProvider>
            <div id={APPLICATION_CONTAINER_ID} className={`${eccgui}-application__container ${className}`} {...otherDivProps}>
                {children}
            </div>
        </OverlaysProvider>
    );
};

export default ApplicationContainer;
