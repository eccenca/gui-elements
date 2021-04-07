import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface IWorkspaceHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: any;
    /**
        space-delimited list of class names
    */
    className?: string;
}

function WorkspaceHeader({ children, className = '', ...otherProps }: IWorkspaceHeaderProps) {
    return (
        <div className={`${eccgui}-workspace__header ` + className} {...otherProps}>
            { children }
        </div>
    )
}

export default WorkspaceHeader;
