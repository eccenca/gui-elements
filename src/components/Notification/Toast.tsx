import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Notification from "./Notification";

function Toast({ children, className, timeout = 10000, ...otherProps }: any) {
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
