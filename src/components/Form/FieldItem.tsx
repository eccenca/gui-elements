import React from "react";

import { ClassNames as IntentClassNames, IntentTypes } from "../../common/Intent";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { TestableComponent } from "../interfaces";
import Label, { LabelProps } from "../Label/Label";

/*
    FIXME: Improve development convenience and prevent development errors

    * disabled state could be automatically forwarded to inserted input element,
      currently this need to be dome explicitly .
    * input id could be forwarded to label and input element
    * input id could be created when not given
*/

export interface FieldItemProps extends React.HTMLAttributes<HTMLDivElement>, TestableComponent {
    /**
     * Set primary state.
     * This is not routed through automatically.
     * @deprecated (v25) use `intent="primary"` instead.
     */
    hasStatePrimary?: boolean;
    /**
     * Set success state.
     * This is not routed through automatically.
     * @deprecated (v25) use `intent="success"` instead.
     */
    hasStateSuccess?: boolean;
    /**
     * Set warning state.
     * This is not routed through automatically.
     * @deprecated (v25) use `intent="warning"` instead.
     */
    hasStateWarning?: boolean;
    /**
     * Set danger state.
     * This is not routed through automatically.
     * @deprecated (v25) use `intent="danger"` instead.
     */
    hasStateDanger?: boolean;
    /**
     * Intent state of the field item.
     */
    intent?: IntentTypes;
    /**
     * Is disabled.
     * The included inout element nedd to set disabled directly itself.
     * This is not routed through automatically.
     */
    disabled?: boolean;
    /**
     * Used to set properties for the `Label` element that is used.
     */
    labelProps?: LabelProps;
    /**
     * Text for user help.
     * Is displayed between label and input element.
     */
    helperText?: string | JSX.Element;
    /**
     * Feedback notification.
     * Is displayed below the included input element.
     */
    messageText?: string;
}

/**
 * Form element that manages the combination of label, helper texts, input element and feedback messages.
 */
export const FieldItem = ({
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
    intent,
    ...otherProps
}: FieldItemProps) => {
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

    const intentClass = intent ? " " + IntentClassNames[intent.toUpperCase()] : "";

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
            <p className={`${eccgui}-fielditem__message` + (intentClass || classIntent)}>{messageText}</p>
        ) : (
            <div className={`${eccgui}-fielditem__message` + (intentClass || classIntent)}>{messageText}</div>
        ));

    return (
        <div
            className={
                `${eccgui}-fielditem` +
                (className ? " " + className : "") +
                (disabled ? ` ${eccgui}-fielditem--disabled` : "")
            }
            {...otherProps}
        >
            {label}
            {userhelp}
            {inputfields}
            {notification}
        </div>
    );
};

export default FieldItem;
