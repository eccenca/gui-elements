import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface ApplicationContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ApplicationContainer = ({
    children,
    className = "",
    ...otherDivProps
}: ApplicationContainerProps) => {

    return (
        <div className={`${eccgui}-application__container ${className}`} {...otherDivProps}>
            { children }
        </div>
    )
}

export default ApplicationContainer;
