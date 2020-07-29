import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

/*
    TODO:

    * allow grow factors for children
*/

function FieldItemRow({ children, className, ...otherProps }: any) {
    return <div className={`${eccgui}-fielditem__row` + (className ? " " + className : "")}>{children}</div>;
}

export default FieldItemRow;
