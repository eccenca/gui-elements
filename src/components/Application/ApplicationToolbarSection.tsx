import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export type ApplicationToolbarSectionProps = React.HTMLAttributes<HTMLDivElement>;

export const ApplicationToolbarSection = ({
    children,
    className = "",
    ...otherDivProps
}: ApplicationToolbarSectionProps) => {
    return (
        <div
            {...otherDivProps}
            className={cn("flex items-center px-2", `${eccgui}-application__toolbar__section`, className)}
        >
            {children}
        </div>
    );
};

export default ApplicationToolbarSection;
