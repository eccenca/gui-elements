import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

/*
    TODO:

    * allow grow factors for children
*/

interface IFieldItemRowProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
        all sub elements that are shown side to side in on row, they are supposed to be FieldItem elements
    */
    children: JSX.Element | JSX.Element[]; // Currently it seems not possible to restrict it only to FieldItem with Typescript
    /**
        space-delimited list of class names
    */
    className?: string;
}

function FieldItemRow({ children, className, ...otherProps }: IFieldItemRowProps) {
    return <div className={`${eccgui}-fielditem__row` + (className ? " " + className : "")}>{children}</div>;
}

export default FieldItemRow;
