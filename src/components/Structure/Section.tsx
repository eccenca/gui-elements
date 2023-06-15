import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {};

export const Section = ({ children, className = '', ...restProps }: SectionProps) => {
    return (
        <section
            {...restProps}
            className={`${eccgui}-structure__section ` + className}
        >
            { children }
        </section>
    )
}

export default Section;
