import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface ApplicationToolbarSectionProps extends React.HTMLAttributes<HTMLDivElement> {};

export const ApplicationToolbarSection = ({
    children,
    className = "",
    ...otherDivProps
}: ApplicationToolbarSectionProps) => {
    return (
        <div
            {...otherDivProps}
            className={`${eccgui}-application__toolbar__section ` + className}
        >
            { children }
        </div>
    )
}

export default ApplicationToolbarSection;
