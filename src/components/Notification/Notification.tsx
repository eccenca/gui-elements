import React from "react";
import { Toast as BlueprintToast, Classes as BlueprintClassNames } from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import * as IntentClassNames from "./../Intent/classnames";
import Icon from "./../Icon/Icon";

function Notification({
    actions,
    children,
    className,
    message,
    success = false,
    warning = false,
    danger = false,
    fullWidth = false,
    timeout,
    ...otherProps
}: any) {
    let intentLevel = IntentClassNames.INFO;
    let iconSymbol = "state-info";
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
            icon={<Icon name={iconSymbol} className={BlueprintClassNames.ICON} />}
            {...otherProps}
        />
    );
}

export default Notification;
