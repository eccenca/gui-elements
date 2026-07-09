import React from "react";

import { ClassNames as IntentClassNames, IntentTypes } from "../../common/Intent";
import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

/**
 * Boxed background + legend/message text color, keyed by `intent`. Mirrors the historical
 * `form.scss` `.eccgui-fieldset.eccgui-intent--x` rules - only these four intents were ever
 * colored (every other intent, or no intent, keeps the neutral defaults below).
 *
 * Note `primary` intentionally maps to the semantic "info" color here (matching the legacy
 * rule byte-for-byte), which differs from `FieldItem`'s `primary` -> accent/primary mapping -
 * a pre-existing inconsistency between the two components, kept as-is for visual parity.
 */
const fieldsetIntentColors: Partial<Record<IntentTypes, { text: string; boxedBackground: string }>> = {
    primary: { text: "text-info", boxedBackground: "bg-info/10" },
    success: { text: "text-success", boxedBackground: "bg-success/10" },
    warning: { text: "text-warning", boxedBackground: "bg-warning/10" },
    danger: { text: "text-destructive", boxedBackground: "bg-destructive/10" },
};

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
    helperText?: string | React.JSX.Element;
    /**
     * Optional notification text.
     * If given then it is displayed before the fieldset content and is colored reagarding the set intent state.
     */
    messageText?: string | React.JSX.Element;
    /**
     * Optional title, set the fieldset legend and if given it is display on top, colored reagarding the set intent state.
     *
     */
    title?: string | React.JSX.Element;
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
    const intentColors = intent ? fieldsetIntentColors[intent] : undefined;

    const userhelp =
        helperText &&
        (typeof helperText === "string" ? (
            <p className={cn(`${eccgui}-fieldset__helpertext`, "block text-xs text-muted-foreground mt-1")}>
                {helperText}
            </p>
        ) : (
            <div className={cn(`${eccgui}-fieldset__helpertext`, "block text-xs text-muted-foreground mt-1")}>
                {helperText}
            </div>
        ));

    const messageClassName = cn(
        `${eccgui}-fieldset__message`,
        "block text-xs mt-1",
        intentColors ? intentColors.text : "text-muted-foreground",
    );
    const notification =
        messageText &&
        (typeof messageText === "string" ? (
            <p className={messageClassName}>{messageText}</p>
        ) : (
            <div className={messageClassName}>{messageText}</div>
        ));

    const fielditems = children && (
        <div className={cn(`${eccgui}-fieldset__fielditems`, "[&:not(:first-child)]:mt-4")}>
            {children}
        </div>
    );

    return (
        <fieldset
            className={cn(
                `${eccgui}-fieldset`,
                "block min-w-0 max-w-full [&:not(:last-child)]:mb-4",
                intent && IntentClassNames[intent.toUpperCase()],
                boxed && `${eccgui}-fieldset--boxed rounded-lg border border-border p-4`,
                boxed && (intentColors ? intentColors.boxedBackground : "bg-muted"),
                className,
            )}
            {...otherProps}
        >
            {title && (
                <legend
                    className={cn(
                        "block w-full text-sm font-semibold tracking-tight",
                        intentColors ? intentColors.text : "text-foreground",
                    )}
                >
                    {title}
                </legend>
            )}
            {userhelp}
            {notification}
            {fielditems}
        </fieldset>
    );
};

export default FieldSet;
