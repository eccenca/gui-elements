import React from "react";
import { Toast as BlueprintToast, Classes as BlueprintClassNames } from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import {ClassNames as IntentClassNames} from "../../common/Intent";
import Icon from "./../Icon/Icon";

function Notification({
    actions,
    children,
    className,
    message,
    success = false,
    warning = false,
    danger = false,
    neutral = false,
    fullWidth = false,
    iconName = "state-info",
    timeout,
    ...otherProps
}: any) {
    let intentLevel = IntentClassNames.INFO;
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
                (fullWidth ? ` ${eccgui}-notification--fullwidth` : "") +
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
