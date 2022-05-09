import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

/*
    FIXME: allow grow factors for children
*/
/** Allows to layout field items horizontally. */
function FieldItemRow({ children, className, ...otherProps }: any) {
    return <div className={`${eccgui}-fielditem__row` + (className ? " " + className : "")}>{children}</div>;
}

export default FieldItemRow;
