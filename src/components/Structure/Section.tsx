import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export type SectionProps = React.HTMLAttributes<HTMLElement>;

export const Section = ({ children, className = "", ...restProps }: SectionProps) => {
    return (
        <section {...restProps} className={`${eccgui}-structure__section ` + className}>
            {children}
        </section>
    );
};

export default Section;
