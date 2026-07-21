import React from "react";

import { ClassNames as IntentClassNames, IntentTypes } from "@/common/Intent";
import { cn } from "@/common/utils/cn";
import Label, { LabelProps } from "@/components/atoms/Label/Label";
import { TestableComponent } from "@/components/interfaces";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

/**
 * Text color for the `messageText` notification, keyed by `intent`. Mirrors the historical
 * `form.scss` `.eccgui-fielditem__message.eccgui-intent--x` rules - only these four intents were
 * ever colored, every other intent (or no intent at all) keeps the muted default caption color.
 */
const messageIntentColorClassName: Partial<Record<IntentTypes, string>> = {
    primary: "text-primary",
    success: "text-success",
    warning: "text-warning",
    danger: "text-destructive",
};

export interface FieldItemProps extends React.HTMLAttributes<HTMLDivElement>, TestableComponent {
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
    helperText?: string | React.JSX.Element;
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
    children,
    className,
    disabled,
    labelProps,
    helperText,
    messageText,
    intent,
    ...otherProps
}: FieldItemProps) => {
    const intentClass = intent ? " " + IntentClassNames[intent.toUpperCase()] : "";

    const label = <Label {...labelProps} disabled={disabled} />;

    const helpertextClassName = cn(
        `${eccgui}-fielditem__helpertext`,
        "mt-1 block text-xs text-muted-foreground",
        // was: `.eccgui-fielditem--disabled > & { color: ...; opacity: ...; }`
        disabled && "text-foreground opacity-50",
    );
    const userhelp =
        helperText &&
        (typeof helperText === "string" ? (
            <p className={helpertextClassName}>{helperText}</p>
        ) : (
            <div className={helpertextClassName}>{helperText}</div>
        ));

    const inputfields = children && (
        <div
            className={cn(
                `${eccgui}-fielditem__inputfields`,
                "[&:not(:first-child)]:mt-1.5 [&:not(:last-child)]:mb-1.5",
            )}
        >
            {children}
        </div>
    );

    const messageClassName = cn(
        `${eccgui}-fielditem__message${intentClass}`,
        "mt-1 block text-xs",
        (intent && messageIntentColorClassName[intent]) || "text-muted-foreground",
        // was: `.eccgui-fielditem--disabled > & { color: ...; opacity: ...; }` (overrides intent color)
        disabled && "text-foreground opacity-50",
    );
    const notification =
        messageText &&
        (typeof messageText === "string" ? (
            <p className={messageClassName}>{messageText}</p>
        ) : (
            <div className={messageClassName}>{messageText}</div>
        ));

    return (
        <div
            className={cn(
                `${eccgui}-fielditem`,
                "block min-w-0 max-w-full [&:not(:last-child)]:mb-4",
                disabled && `${eccgui}-fielditem--disabled`,
                className,
            )}
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
