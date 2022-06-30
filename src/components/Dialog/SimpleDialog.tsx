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
import IconButton from "../Icon/IconButton";

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
    headerOptions?: null | JSX.Element | JSX.Element[];
    /**
     * If enabled neither closing via `esc` key or clicking outside of the component will work, except explicitly specified.
     */
    preventSimpleClosing?: boolean;
    /**
     * Define purpose of the dialog, e.g. if it is a warning.
     */
    intent?: IntentTypes;
    /** Optional props for the wrapper div element inside the modal. */
    wrapperDivProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
    /** If a full screen toggler is shown that will allow to switch to full screen mode. */
    showFullScreenToggler?: boolean
    /** Starts the modal in full screen mode. The show full screen toggler will be automatically enabled. */
    startInFullScreenMode?: boolean
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
    showFullScreenToggler = false,
    startInFullScreenMode = false,
    size,
    ...otherProps
}: SimpleDialogProps) {
    const [displayFullscreen, setDisplayFullscreen] = React.useState<boolean>(startInFullScreenMode);
    const showToggler = startInFullScreenMode || showFullScreenToggler
    const intentClassName = intent ? `${eccgui}-intent--${intent}` : "";
    return (
        <Modal
            {...otherProps}
            // set default test id if not given
            data-test-id={otherProps["data-test-id"] ?? "simpleDialogWidget"}
            canOutsideClickClose={canOutsideClickClose || !preventSimpleClosing}
            canEscapeKeyClose={canEscapeKeyClose || !preventSimpleClosing}
            size={displayFullscreen ? "fullscreen" : size}
        >
            <Card className={intentClassName}
            >
                {(title || headerOptions || showToggler) && (
                    <CardHeader>
                        <CardTitle
                            className={intentClassName}
                        >
                            {title}
                        </CardTitle>
                        {(headerOptions || showToggler) ? (
                            <CardOptions>
                                { headerOptions }
                                {showToggler && (
                                    <IconButton
                                        name={displayFullscreen ? "toggler-minimize" : "toggler-maximize"}
                                        onClick={() => setDisplayFullscreen(!displayFullscreen)}
                                    />
                                )}
                            </CardOptions>
                        ) : (
                            <></>
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
