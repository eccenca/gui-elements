/*
    provides a simple interface for alert dialogs
*/

import React from "react";
import * as IntentClassNames from "./../Intent/classnames";
import SimpleDialog from "./SimpleDialog";
import { ISimpleDialogProps } from "./SimpleDialog";

interface IAlertDialogProps extends ISimpleDialogProps {
    children: any;
    /**
        use success color scheme for dialog card, title and buttons, default: false
    */
    success?: boolean;
    /**
        use warning color scheme for dialog card, title and buttons, default: false
    */
    warning?: boolean;
    /**
        use danger color scheme for dialog card, title and buttons, default: false
    */
    danger?: boolean;
}

function AlertDialog({ children, success = false, warning = false, danger = false, ...otherProps }: IAlertDialogProps) {
    let intentLevel = IntentClassNames.INFO;
    if (success) {
        intentLevel = IntentClassNames.SUCCESS;
    }
    if (warning) {
        intentLevel = IntentClassNames.WARNING;
    }
    if (danger) {
        intentLevel = IntentClassNames.DANGER;
    }

    return (
        <SimpleDialog size="tiny" preventSimpleClosing={true} intent={intentLevel} {...otherProps}>
            {children}
        </SimpleDialog>
    );
}

export default AlertDialog;
