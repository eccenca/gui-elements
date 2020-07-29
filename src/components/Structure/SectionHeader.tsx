import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function SectionHeader({ children, className = '', ...restProps }: any) {
    return (
        <header
            {...restProps}
            className={`${eccgui}-structure__section__header `+className}
        >
            { children }
        </header>
    )
}

export default SectionHeader;
