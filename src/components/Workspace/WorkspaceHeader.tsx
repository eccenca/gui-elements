import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface WorkspaceHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: any;
    /**
        space-delimited list of class names
    */
    className?: string;
}

export type IWorkspaceHeaderProps = WorkspaceHeaderProps;

export const WorkspaceHeader = ({ children, className = "", ...otherProps }: WorkspaceHeaderProps) => {
    return (
        <div
            className={cn(
                // 56px bar that sits inside the application header and shares its `--sidebar` surface;
                // `flex-col justify-center` vertically centers the portalled content while keeping it
                // full-width (stretched), so right-aligned actions stay flush right; `px-2` = the former
                // `mini-units(1)` (8px) horizontal inset
                "flex h-14 min-w-0 grow flex-col justify-center bg-sidebar px-2",
                `${eccgui}-workspace__header`,
                className,
            )}
            {...otherProps}
        >
            {children}
        </div>
    );
};

export default WorkspaceHeader;
