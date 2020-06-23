/*
    provides a simple interface for dialogs using modals with a card inside
*/

import React from "react";
import { Card, CardActions, CardContent, CardHeader, CardTitle } from "./../Card";
import Divider from "./../Separation/Divider";
import Modal from "./Modal";
import { IModalProps } from "./Modal";

export interface ISimpleDialogProps extends IModalProps {
    children: any;
    /**
        title of the modal dialog, if necessary, default: empty
    */
    title?: string;
    /**
        content of the action row at the bottom of the modal dialog, should be mainly buttons, default: empty
    */
    actions?: JSX.Element | JSX.Element[];
    /**
        content of notification area, always visible between dialog content and action row at the bottom, default: empty
    */
    notifications?: JSX.Element | string;
    /**
        add horizontal rules between title, content and action row, default: false
    */
    hasBorder?: boolean;
    /**
        do not allow to cloase modal by outside click or escape key, default: false (can be overwritten by explicit options)
    */
    preventSimpleClosing?: boolean;
    /**
        blueprint class name of intent, e.g. for info, success, warning or danger color schemes
    */
    intent?: string; // TODO: change to own intent management here
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
}: any) {
    return (
        <Modal
            {...otherProps}
            canOutsideClickClose={canOutsideClickClose || !preventSimpleClosing}
            canEscapeKeyClose={canEscapeKeyClose || !preventSimpleClosing}
        >
            <Card className={intent ? intent : ""}>
                {title && (
                    <CardHeader>
                        <CardTitle className={intent ? intent : ""}>{title}</CardTitle>
                    </CardHeader>
                )}
                {hasBorder && <Divider />}
                <CardContent>{children}</CardContent>
                {hasBorder && <Divider />}
                {!!notifications && <CardContent className="ecc-dialog__notifications">{notifications}</CardContent>}
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
