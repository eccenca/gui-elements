/*
    provides a simple interface for dialogs using modals with a card inside
*/

import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import {ClassNames as IntentClassNames} from "../../common/Intent";
import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardOptions,
    CardTitle,
} from "./../Card";
import Divider from "./../Separation/Divider";
import Modal, { IModalProps } from "./Modal";
import {TestableComponent} from "../interfaces";

export interface ISimpleDialogProps extends IModalProps, TestableComponent {
    // The title of the dialog
    title?: string;
    // include elements to the action row, e.g. Buttons
    actions?: React.ReactNode | React.ReactNode[];
    notifications?: React.ReactNode | React.ReactNode[];
    // If this dialog should have borders or not
    hasBorder?: boolean;
    // If enabled neither closing via ESC key or clicking outside of the component will work, except explicitly specified.
    preventSimpleClosing?: boolean;
    // add special class name to display intent of dialog
    intentClassName?:
        | typeof IntentClassNames.INFO
        | typeof IntentClassNames.SUCCESS
        | typeof IntentClassNames.WARNING
        | typeof IntentClassNames.DANGER;

    //can contain elements actionable/non-actionable elements in the dialog header
    headerOptions?: React.ReactNode | React.ReactNode[];
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
    intentClassName = "",
    headerOptions,
    ...otherProps
}: ISimpleDialogProps) {
    return (
        <Modal
            {...otherProps}
            // set default test id if not given
            data-test-id={otherProps["data-test-id"] ?? "simpleDialogWidget"}
            canOutsideClickClose={canOutsideClickClose || !preventSimpleClosing}
            canEscapeKeyClose={canEscapeKeyClose || !preventSimpleClosing}
        >
            <Card className={intentClassName ?? ""}
            >
                {(title || headerOptions) && (
                    <CardHeader>
                        <CardTitle
                            className={intentClassName ?? ""}
                        >
                            {title}
                        </CardTitle>
                        {headerOptions && (
                            <CardOptions>{headerOptions}</CardOptions>
                        )}
                    </CardHeader>
                )}
                {hasBorder && <Divider />}
                <CardContent>{children}</CardContent>
                {hasBorder && <Divider />}
                {!!notifications && (
                    <CardContent className={`${eccgui}-dialog__notifications`}>
                        {notifications}
                    </CardContent>
                )}
                {actions && (
                    <CardActions
                        inverseDirection
                        className={intentClassName ?? ""}
                    >
                        {actions}
                    </CardActions>
                )}
            </Card>
        </Modal>
    );
}

export default SimpleDialog;
