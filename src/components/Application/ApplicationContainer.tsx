import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface ApplicationContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

function ApplicationContainer({
    children,
    className = "",
    ...otherProps
}: ApplicationContainerProps) {

    return (
        <div className={`${eccgui}-application__container ${className}`} {...otherProps}>
            { children }
        </div>
    )
}

export default ApplicationContainer;
