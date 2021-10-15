/*
    provides a simple interface for alert dialogs
*/

import React from 'react';
import {ClassNames as IntentClassNames} from "../../common/Intent";
import SimpleDialog, { ISimpleDialogProps } from './SimpleDialog';

export interface IAlertDialogProps extends ISimpleDialogProps {
    // set to true if alert dialog displays a success message
    success?: boolean;
    // set to true if alert dialog displays a warning
    warning?: boolean;
    // set to true if alert dialog displays a strong message about errors or disruptive actions
    danger?: boolean;
}


function AlertDialog({
    children,
    success=false,
    warning=false,
    danger=false,
    ...otherProps
}: IAlertDialogProps) {
    let intentLevel = IntentClassNames.INFO;
    if (success) { intentLevel = IntentClassNames.SUCCESS; }
    if (warning) { intentLevel = IntentClassNames.WARNING; }
    if (danger) { intentLevel = IntentClassNames.DANGER; }

    return (
        <SimpleDialog
            size="tiny"
            preventSimpleClosing={true}
            intentClassName={intentLevel}
            {...otherProps}
        >
            {children}
        </SimpleDialog>
    );
};

export default AlertDialog;
