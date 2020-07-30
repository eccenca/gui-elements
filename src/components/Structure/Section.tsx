import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function Section({ children, className = '', ...restProps }: any) {
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
