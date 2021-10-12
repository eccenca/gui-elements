import React from "react";
import Label from "../Label/Label";
import * as IntentClassNames from "../Intent/classnames";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import {TestableComponent} from "@gui-elements/src/components/interfaces";

/*
    TODO:

    * disabled stae could be automatically forwarded to inserted input element,
      currently this need to be dome explicitely .
    * input id could be forwarded to label and input element
    * input id could be created when not given
*/

interface IProps extends TestableComponent {
    hasStatePrimary?: boolean
    hasStateSuccess?: boolean
    hasStateWarning?: boolean
    hasStateDanger?: boolean
    children: JSX.Element | JSX.Element[] | null
    className?: string
    disabled?: boolean
    labelAttributes?: object
    helperText?: string | JSX.Element
    messageText?: string
}

function FieldItem({
    hasStatePrimary = false,
    hasStateSuccess = false,
    hasStateWarning = false,
    hasStateDanger = false,
    children,
    className,
    disabled,
    labelAttributes = {},
    helperText,
    messageText,
    ...otherProps
}: IProps) {
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

    const label = <Label {...labelAttributes} disabled={disabled} />;

    const userhelp =
        helperText &&
        (typeof helperText === "string" ? (
            <p className={`${eccgui}-fielditem__helpertext`}>{helperText}</p>
        ) : (
            <div className={`${eccgui}-fielditem__helpertext`}>{helperText}</div>
        ));

    const inputfields = children && <div className={`${eccgui}-fielditem__inputfields`}>{children}</div>;

    const notification =
        messageText &&
        (typeof messageText === "string" ? (
            <p className={`${eccgui}-fielditem__message` + classIntent}>{messageText}</p>
        ) : (
            <div className={`${eccgui}-fielditem__message` + classIntent}>{messageText}</div>
        ));

    return (
        <div
            data-test-id={otherProps["data-test-id"]}
            className={
                `${eccgui}-fielditem` + (className ? " " + className : "") + (disabled ? ` ${eccgui}-fielditem--disabled` : "")
            }
        >
            {label}
            {userhelp}
            {inputfields}
            {notification}
        </div>
    );
}

export default FieldItem;
