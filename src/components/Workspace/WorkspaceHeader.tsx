import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function WorkspaceHeader({ children, className = '' }: any) {
    return (
        <div className={`${eccgui}-workspace__header ` + className}>
            { children }
        </div>
    )
}

export default WorkspaceHeader;
