/*
    provides a simple interface for alert dialogs
*/

import React from 'react';
import {Definitions as IntentStates, IntentTypes} from "../../common/Intent";
import SimpleDialog, { SimpleDialogProps } from './SimpleDialog';

export interface IAlertDialogProps extends Omit<SimpleDialogProps, "intent"> {
  /**
   * set to true if alert dialog displays a success message
   */
  success?: boolean;
  /**
   *  set to true if alert dialog displays a warning
   */
  warning?: boolean;
  /**
   * set to true if alert dialog displays a strong message about errors or disruptive actions
   */
  danger?: boolean;
}

/**
 * Special element to display alert notification in modal dialogs.
 * Inherits all properties from `SimpleDialog`, except `intent`.
 */
function AlertDialog({
    children,
    success=false,
    warning=false,
    danger=false,
    ...otherProps
}: IAlertDialogProps) {
    let intentLevel: IntentTypes = IntentStates.INFO;
    if (success) { intentLevel = IntentStates.SUCCESS; }
    if (warning) { intentLevel = IntentStates.WARNING; }
    if (danger) { intentLevel = IntentStates.DANGER; }

    return (
        <SimpleDialog
            size="tiny"
            preventSimpleClosing={true}
            intent={intentLevel}
            {...otherProps}
        >
            {children}
        </SimpleDialog>
    );
};

export default AlertDialog;
