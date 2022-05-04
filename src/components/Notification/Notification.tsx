import React from "react";
import {
    Toast as BlueprintToast,
    ToastProps as BlueprintToastProps,
    Classes as BlueprintClassNames,
} from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import {ClassNames as IntentClassNames} from "../../common/Intent";
import Icon from "./../Icon/Icon";
import { ValidIconName } from "./../Icon/canonicalIconNames";

export interface NotificationProps extends Omit<BlueprintToastProps, "message" | "action" | "icon" | "intent">, React.HTMLAttributes<HTMLDivElement> {
    /**
     * Extra user action elements
     */
    actions?: JSX.Element | JSX.Element[];
    /**
     * Notification message that can be used as alternative to children elements.
     */
    message?: JSX.Element | string;
    /**
     * Notification has a neutral color scheme.
     */
    neutral?: boolean;
    /**
     * Notification is a success info.
     * This defines the colorization and the icon symbol.
     */
    success?: boolean;
    /**
     * Notification is a warning alert.
     * This defines the colorization and the icon symbol.
     */
    warning?: boolean;
    /**
     * Notification is a danger alert.
     * This defines the colorization and the icon symbol.
     */
    danger?: boolean;
    /**
     * Notification uses the the given space more flexible.
     * Depracation notice: Property name will removed in futire versions.
     * Please use `flexWidth`.
     * @depracted
     */
    fullWidth?: boolean;
    /**
     * Notification uses the the given space more flexible.
     * Default notifcation is displayed in min and max limits.
     * Those limits are removed by setting this property to `true`.
     */
    flexWidth?: boolean;
    /**
     * Icon used as depiction that is displayed with the notification.
     */
    iconName?: ValidIconName;
}

/**
 * Displays a notification message, optionally combined with depiction and further action buttons.
 * By default it uses colorization of an blueish info alert.
 */
function Notification({
    actions,
    children,
    className,
    message,
    success = false,
    warning = false,
    danger = false,
    neutral = false,
    fullWidth = false, // deprecated
    flexWidth = false,
    iconName = "state-info",
    timeout,
    ...otherProps
}: NotificationProps) {
    let intentLevel: string = IntentClassNames.INFO;
    let iconSymbol = iconName;
    switch (true) {
        case success:
            intentLevel = IntentClassNames.SUCCESS;
            iconSymbol = "state-success";
            break;
        case warning:
            intentLevel = IntentClassNames.WARNING;
            iconSymbol = "state-warning";
            break;
        case danger:
            intentLevel = IntentClassNames.DANGER;
            iconSymbol = "state-danger";
            break;
        case neutral:
            intentLevel = IntentClassNames.NEUTRAL;
            break;
    }

    const content = actions ? (
        <div className={`${eccgui}-notification__content`}>
            <div className={`${eccgui}-notification__messagebody`}>{message ? message : children}</div>
            <div className={`${eccgui}-notification__actions`}>{actions}</div>
        </div>
    ) : message ? (
        message
    ) : (
        children
    );

    return (
        <BlueprintToast
            className={
                `${eccgui}-notification ` +
                intentLevel +
                (className ? ` ${className}` : "") +
                (fullWidth ? ` ${eccgui}-notification--fullwidth` : "") + // deprecated
                (flexWidth ? ` ${eccgui}-notification--flexwidth` : "") +
                (otherProps.onDismiss ? "" : ` ${eccgui}-notification--static`)
            }
            message={content}
            timeout={timeout ? timeout : 0}
            icon={!!iconSymbol ? <Icon name={iconSymbol} className={BlueprintClassNames.ICON} /> : undefined}
            {...otherProps}
        />
    );
}

export default Notification;
