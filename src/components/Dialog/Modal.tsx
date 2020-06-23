/*
    we only use Dialog as pre-configured and enhanced Overlay, it is
    recommended to use Card elements inside.
*/

import React from "react";
import {
    Classes as BlueprintClassNames,
    Overlay as BlueprintOverlay,
    IOverlayProps as IBluprintOverlayProps,
} from "@blueprintjs/core";
import { Card } from "./../Card";

export interface IModalProps extends IBluprintOverlayProps {
    children: any;
    /**
        space-delimited list of class names for the content in overlay
    */
    className?: string;
    /**
        space-delimited list of class names for the overlay element
    */
    overlayClassName?: string;
    /**
        size of the modal, one of "tiny", "small", "regular" (default), "large" and "fullscreen"
    */
    size?: "tiny" | "small" | "regular" | "large" | "fullscreen"; // TODO: define global size keywords
    /**
        modal can be closed by outside click, default: false
    */
    canOutsideClickClose?: boolean;
    /**
        modal can be closed by by using escape key, default: false
    */
    canEscapeKeyClose?: boolean;
    /**
        do not use a backdrop area between application and modal overlay, default: false
    */
    preventBackdrop?: boolean;
    /**
        is modal shown or not
    */
    isOpen: boolean;
}

function Modal({
    children,
    className = "",
    overlayClassName = "",
    size = "regular", // tiny, small, regular, large, fullscreen
    canOutsideClickClose = false,
    canEscapeKeyClose = false,
    preventBackdrop = false,
    ...otherProps
}: any) {
    const alteredChildren = React.Children.map(children, (child, index) => {
        if (child.type === Card) {
            return React.cloneElement(child, {
                isOnlyLayout: true,
                elevation: 4,
            });
        }

        return child;
    });

    return (
        <BlueprintOverlay
            {...otherProps}
            className={overlayClassName}
            backdropClassName={"ecc-dialog__backdrop"}
            canOutsideClickClose={canOutsideClickClose}
            canEscapeKeyClose={canEscapeKeyClose}
            hasBackdrop={!preventBackdrop}
        >
            <div className={BlueprintClassNames.DIALOG_CONTAINER}>
                <section
                    className={
                        "ecc-dialog__wrapper" +
                        (typeof size === "string" ? " ecc-dialog__wrapper--" + size : "") +
                        (className ? " " + className : "")
                    }
                >
                    {alteredChildren}
                </section>
            </div>
        </BlueprintOverlay>
    );
}

export default Modal;
