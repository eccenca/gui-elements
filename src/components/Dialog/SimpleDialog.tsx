/*
    provides a simple interface for dialogs using modals with a card inside
*/

import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { Card, CardActions, CardContent, CardHeader, CardTitle } from "./../Card";
import Divider from "./../Separation/Divider";
import Modal, {IModalProps} from "./Modal";

export interface IProps extends IModalProps {
    // The title of the dialog
    title?: string
    actions?: any // TODO: What type??
    notifications?: any // TODO: What type??
    // If this dialog should have borders or not
    hasBorder?: boolean
    // If enabled neither closing via ESC key or clicking outside of the component will work, except explicitly specified.
    preventSimpleClosing?: boolean
    intent?: string // TODO: What possible values?
}

function SimpleDialog({
    children,
    canOutsideClickClose = false,
    canEscapeKeyClose = false,
    title = "",
    actions = null,
    notifications = null,
    hasBorder = false,
    preventSimpleClosing = false,
    intent = "",
    ...otherProps
}: IProps) {
    return (
        <Modal
            {...otherProps}
            canOutsideClickClose={canOutsideClickClose || !preventSimpleClosing}
            canEscapeKeyClose={canEscapeKeyClose || !preventSimpleClosing}
        >
            <Card
                className={intent ? intent : ""}
                // FIXME: this is a workaround because data ttribute on SimpleDialog is not correctly routed to the overlay by blueprint js
                data-test-id={"simpleDialogWidget"}
            >
                {title && (
                    <CardHeader>
                        <CardTitle className={intent ? intent : ""}>{title}</CardTitle>
                    </CardHeader>
                )}
                {hasBorder && <Divider />}
                <CardContent>{children}</CardContent>
                {hasBorder && <Divider />}
                {!!notifications && <CardContent className={`${eccgui}-dialog__notifications`}>{notifications}</CardContent>}
                {actions && (
                    <CardActions inverseDirection className={intent ? intent : ""}>
                        {actions}
                    </CardActions>
                )}
            </Card>
        </Modal>
    );
}

export default SimpleDialog;
