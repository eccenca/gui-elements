import React from "react";
import Label, { LabelProps } from "../Label/Label";
import {ClassNames as IntentClassNames} from "../../common/Intent";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import {TestableComponent} from "../interfaces";

/*
    FIXME: Improve development convenience and prevent development errors

    * disabled state could be automatically forwarded to inserted input element,
      currently this need to be dome explicitly .
    * input id could be forwarded to label and input element
    * input id could be created when not given
*/

export interface FieldItemProps extends React.HTMLAttributes<HTMLDivElement>, TestableComponent {
    hasStatePrimary?: boolean
    hasStateSuccess?: boolean
    hasStateWarning?: boolean
    hasStateDanger?: boolean
    children: JSX.Element | JSX.Element[] | null
    className?: string
    disabled?: boolean
    labelProps?: LabelProps
    helperText?: string | JSX.Element
    messageText?: string
}

/**
 * Form element that manages the combination of label, helper texts, input element and feedback messages.
 */
function FieldItem({
    hasStatePrimary = false,
    hasStateSuccess = false,
    hasStateWarning = false,
    hasStateDanger = false,
    children,
    className,
    disabled,
    labelProps,
    helperText,
    messageText,
    ...otherProps
}: FieldItemProps) {
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

    const label = <Label {...labelProps} disabled={disabled} />;

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
            className={
                `${eccgui}-fielditem` + (className ? " " + className : "") + (disabled ? ` ${eccgui}-fielditem--disabled` : "")
            }
            {...otherProps}
        >
            {label}
            {userhelp}
            {inputfields}
            {notification}
        </div>
    );
}

export default FieldItem;
