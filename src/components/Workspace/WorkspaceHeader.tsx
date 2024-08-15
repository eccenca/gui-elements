import React from "react";

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
        <div className={`${eccgui}-workspace__header ` + className} {...otherProps}>
            {children}
        </div>
    );
};

export default WorkspaceHeader;
