import React from "react";
import * as IntentClassNames from "../Intent/classnames";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface IFieldSetProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
    /**
        children of FieldSet, preferable FieldItem elements but it is not limited to them
    */
    children?: any;
    /**
        space-delimited list of class names
    */
    className?: string;
    /**
        title of FieldSet
    */
    legendTitle?: JSX.Element | string;
    /**
        supporting short description that helps the user to understand what the contained items are used for
    */
    helperText?: JSX.Element | string;
    /**
        message text with special intent, e.g. warnings
    */
    messageText?: JSX.Element | string;
    /**
        increase the grouping of form elements and display it in a box with dedicated background color
    */
    boxed?: boolean;
    // TODO: planned to make deprecated
    hasStatePrimary?: boolean;
    hasStateSuccess?: boolean;
    hasStateWarning?: boolean;
    hasStateDanger?: boolean;
}

function FieldSet({
    boxed = false,
    children,
    className,
    hasStatePrimary = false,
    hasStateSuccess = false,
    hasStateWarning = false,
    hasStateDanger = false,
    helperText,
    messageText,
    legendTitle,
    ...otherProps
}: IFieldSetProps) {
    let classIntent = "";
    switch (true) {
        case hasStatePrimary:
            classIntent = " " + IntentClassNames.PRIMARY;
            break;
        case hasStateSuccess:
            classIntent = " " + IntentClassNames.SUCCESS;
            break;
        case hasStateWarning:
            classIntent = " " + IntentClassNames.WARNING;
            break;
        case hasStateDanger:
            classIntent = " " + IntentClassNames.DANGER;
            break;
        default:
            break;
    }

    const userhelp =
        helperText &&
        (typeof helperText === "string" ? (
            <p className={`${eccgui}-fieldset__helpertext`}>{helperText}</p>
        ) : (
            <div className={`${eccgui}-fieldset__helpertext`}>{helperText}</div>
        ));

    const notification =
        messageText &&
        (typeof messageText === "string" ? (
            <p className={`${eccgui}-fieldset__message`}>{messageText}</p>
        ) : (
            <div className={`${eccgui}-fieldset__message`}>{messageText}</div>
        ));

    const fielditems = children && <div className={`${eccgui}-fieldset__fielditems`}>{children}</div>;

    return (
        <fieldset
            className={
                `${eccgui}-fieldset` +
                (className ? " " + className : "") +
                classIntent +
                (boxed ? ` ${eccgui}-fieldset--boxed` : "")
            }
            {...otherProps}
        >
            {legendTitle && <legend>{legendTitle}</legend>}
            {userhelp}
            {notification}
            {fielditems}
        </fieldset>
    );
}

export default FieldSet;
