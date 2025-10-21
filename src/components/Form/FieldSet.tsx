import React from "react";

import { ClassNames as IntentClassNames, IntentTypes } from "../../common/Intent";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface FieldSetProps extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, "title"> {
    /**
     * Displays the fieldset inside a box.
     * Background color of the box is set automatically regarding the set intent state.
     */
    boxed?: boolean;
    /**
     * Intent state of the field item.
     */
    intent?: IntentTypes;
    /**
     * Optional helper text. If given then it is displayed after the title.
     */
    helperText?: string | JSX.Element;
    /**
     * Optional notification text.
     * If given then it is displayed before the fieldset content and is colored reagarding the set intent state.
     */
    messageText?: string | JSX.Element;
    /**
     * Optional title, set the fieldset legend and if given it is display on top, colored reagarding the set intent state.
     *
     */
    title?: string | JSX.Element;
}

/**
 * Displays a group of input elements.
 */
export const FieldSet = ({
    boxed = false,
    children,
    className,
    intent,
    helperText,
    messageText,
    title,
    ...otherProps
}: FieldSetProps) => {
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
                (intent ? " " + IntentClassNames[intent.toUpperCase()] : "") +
                (boxed ? ` ${eccgui}-fieldset--boxed` : "")
            }
            {...otherProps}
        >
            {title && <legend>{title}</legend>}
            {userhelp}
            {notification}
            {fielditems}
        </fieldset>
    );
};

export default FieldSet;
