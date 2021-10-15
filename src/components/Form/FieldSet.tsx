import React from "react";
import {ClassNames as IntentClassNames} from "../../common/Intent";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

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
    title,
    ...otherProps
}: any) {
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
        >
            {title && <legend>{title}</legend>}
            {userhelp}
            {notification}
            {fielditems}
        </fieldset>
    );
}

export default FieldSet;
