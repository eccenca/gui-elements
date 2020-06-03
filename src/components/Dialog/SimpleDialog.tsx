/*
    provides a simple interface for dialogs using modals with a card inside
*/

import React from "react";
import { Card, CardActions, CardContent, CardHeader, CardTitle } from "./../Card";
import Divider from "./../Separation/Divider";
import Modal from "./Modal";

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
