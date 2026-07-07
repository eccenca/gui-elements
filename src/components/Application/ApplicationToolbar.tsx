import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export type ApplicationToolbarProps = React.HTMLAttributes<HTMLDivElement>;

export const ApplicationToolbar = ({ children, className = "", ...otherDivProps }: ApplicationToolbarProps) => {
    return (
        <div
            {...otherDivProps}
            className={cn("flex h-full grow-0 basis-auto justify-end", `${eccgui}-application__toolbar`, className)}
        >
            {children}
        </div>
    );
};

export default ApplicationToolbar;
