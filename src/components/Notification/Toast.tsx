import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import Notification, { NotificationProps } from "./Notification";

export type ToastProps = NotificationProps;

// FIXME: we need to check if we still need this component. It does not add a lot to `Notification`.

/**
 * Displays a `Notification` with a pre-set `timeout` setting.
 */
function Toast({ children, className, timeout = 10000, ...otherProps }: NotificationProps) {
    return (
        <Notification
            className={`${eccgui}-notification--toast` + (className ? " " + className : "")}
            timeout={timeout}
            {...otherProps}
        >
            {children}
        </Notification>
    );
}

export default Toast;
