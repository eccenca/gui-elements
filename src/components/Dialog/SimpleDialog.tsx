/*
    provides a simple interface for dialogs using modals with a card inside
*/

import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { IntentTypes } from "../../common/Intent";
import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardOptions,
    CardTitle,
} from "./../Card";
import Divider from "./../Separation/Divider";
import Modal, { ModalProps } from "./Modal";
import {TestableComponent} from "../interfaces";

export interface SimpleDialogProps extends ModalProps, TestableComponent {
    /**
     * The title of the dialog.
     */
    title?: string;
    /**
     * Parts of the dialog are separated by a horizontal ruler.
     */
    hasBorder?: boolean;
    /**
     * Include elements to the action footer, e.g. buttons.
     */
    actions?: React.ReactNode | React.ReactNode[];
    /**
     * If populated with elements, then a second contant area is included before the action footer.
     * Mainly provided to include `Notification` elements.
     */
    notifications?: React.ReactNode | React.ReactNode[];
    /**
     * Can contain elements actionable/non-actionable elements display right-aligned to the dialog title.
     */
    headerOptions?: JSX.Element | JSX.Element[];
    /**
     * If enabled neither closing via `esc` key or clicking outside of the component will work, except explicitly specified.
     */
    preventSimpleClosing?: boolean;
    /**
     * Define purpose of the dialog, e.g. if it is a warning.
     */
    intent?: IntentTypes;
}

/**
 * Simplifies the dialog display by providing a direct `Card` template for the `Modal` element.
 * Inherits all properties from `Modal`.
 */
function SimpleDialog({
    children,
    canOutsideClickClose = false,
    canEscapeKeyClose = false,
    title = "",
    actions = null,
    notifications = null,
    hasBorder = false,
    preventSimpleClosing = false,
    intent,
    headerOptions,
    ...otherProps
}: SimpleDialogProps) {
    const intentClassName = intent ? `${eccgui}-intent--${intent}` : "";
    return (
        <Modal
            {...otherProps}
            // set default test id if not given
            data-test-id={otherProps["data-test-id"] ?? "simpleDialogWidget"}
            canOutsideClickClose={canOutsideClickClose || !preventSimpleClosing}
            canEscapeKeyClose={canEscapeKeyClose || !preventSimpleClosing}
        >
            <Card className={intentClassName}
            >
                {(title || headerOptions) && (
                    <CardHeader>
                        <CardTitle
                            className={intentClassName}
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
                        className={intentClassName}
                    >
                        {actions}
                    </CardActions>
                )}
            </Card>
        </Modal>
    );
}

export default SimpleDialog;
