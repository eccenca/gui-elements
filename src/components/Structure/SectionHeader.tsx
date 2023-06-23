import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLElement> {};

export const SectionHeader = ({ children, className = '', ...restProps }: SectionHeaderProps) => {
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
