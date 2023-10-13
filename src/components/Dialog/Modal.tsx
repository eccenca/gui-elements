import React from "react";
import {
    Classes as BlueprintClassNames,
    IOverlayState as BlueprintOverlayState,
    Overlay as BlueprintOverlay,
    OverlayProps as BlueprintOverlayProps,
} from "@blueprintjs/core";

import { Utilities } from "../../common";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { Card } from "./../Card";

export interface ModalProps extends BlueprintOverlayProps, BlueprintOverlayState {
    children: React.ReactNode | React.ReactNode[];
    /**
     * A space-delimited list of class names to pass along to the BlueprintJS `Overlay` element that is used to create the modal.
     */
    overlayClassName?: string;
    /**
     * Size of the modal.
     */
    size?: "tiny" | "small" | "regular" | "large" | "xlarge" | "fullscreen";
    /**
     * Prevents that a backdrop area is displayed behind the modal elements.
     */
    preventBackdrop?: boolean;
    /**
     * Optional props for the wrapper div element inside the modal overlay.
     */
    wrapperDivProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    /**
     * Make the modal focusable, e.g. when clicking somewhere on it.
     * This is needed, e.g. when capturing key (down, up) events that should bubble to the modal's parent elements.
     */
    modalFocusable?: boolean;
    /**
     * Works only for modals inside portals (`usePortal={true}`).
     * When set to `true` then the `z-index` of the modal's portal element is recalculated, so that the modal is always shown on top of all other visible elements.
     * Use this with care!
     * Usually the normal opening sequence is enough to show the currently most important modal on top.
     * If this option is used inflationary then this could harm the visibility of other overlays.
     */
    forceTopPosition?: boolean;
}

/**
 * Displays contents on top of other elements, used to create dialogs.
 * For most situations the usage of `SimpleDialog` and `AlertDialog` should be sufficient.
 * Otherwise this element can be used to create own modal elements and edge cases for modal dialogs.
 * Then it is recommended to use the `Card` element inside.
 */
export const Modal = ({
    children,
    className = "",
    overlayClassName = "",
    size = "regular",
    canOutsideClickClose = false,
    canEscapeKeyClose = false,
    preventBackdrop = false,
    wrapperDivProps,
    modalFocusable = true,
    usePortal = true,
    forceTopPosition = false,
    onOpening,
    ...otherProps
}: ModalProps) => {
    const backdropProps: React.HTMLProps<HTMLDivElement> | undefined =
        !canOutsideClickClose && canEscapeKeyClose
            ? {
                  ...otherProps.backdropProps,
                  // Escape key won't work anymore otherwise after clicking on the backdrop
                  tabIndex: 0,
              }
            : otherProps.backdropProps;

    const focusableProps = modalFocusable
        ? {
              tabIndex: 0,
          }
        : undefined;

    const alteredChildren = React.Children.map(children, (child) => {
        if ((child as React.ReactElement).type && (child as React.ReactElement).type === Card) {
            return React.cloneElement(child as React.ReactElement, {
                isOnlyLayout: true,
                elevation: 4,
            });
        }

        return child;
    });

    const handlerOnOpening = (modalElement: HTMLElement) => {
        if (onOpening) {
            // call the original event handler
            onOpening(modalElement);
        }
        if (usePortal && forceTopPosition) {
            const parentalPortal = modalElement.closest(`.${BlueprintClassNames.PORTAL}`) as HTMLElement;
            const highestTopIndex = (Utilities.getGlobalVar("highestModalTopIndex") as unknown as number) ?? 0;
            if (parentalPortal) {
                const portalTopIndex = parseInt(getComputedStyle(parentalPortal).zIndex ?? 0, 10);
                const newTopIndex = Math.max(portalTopIndex, highestTopIndex) + 1;
                parentalPortal.style.zIndex = `${newTopIndex}`;
                Utilities.setGlobalVar("highestModalTopIndex", newTopIndex);
            }
        }
    };

    return (
        <BlueprintOverlay
            {...otherProps}
            backdropProps={backdropProps}
            className={overlayClassName}
            backdropClassName={`${eccgui}-dialog__backdrop`}
            canOutsideClickClose={canOutsideClickClose}
            canEscapeKeyClose={canEscapeKeyClose}
            hasBackdrop={!preventBackdrop}
            usePortal={usePortal}
            onOpening={handlerOnOpening}
            portalClassName={`${eccgui}-dialog__portal`}
        >
            <div
                {...wrapperDivProps}
                className={BlueprintClassNames.DIALOG_CONTAINER}
                // this is a workaround because data attribute on SimpleDialog is not correctly routed to the overlay by blueprint js
                data-test-id={(otherProps as any)["data-test-id"] ?? "simpleDialogWidget"}
                {...focusableProps}
                tabIndex={0}
            >
                <section
                    className={
                        `${eccgui}-dialog__wrapper` +
                        (typeof size === "string" ? ` ${eccgui}-dialog__wrapper--` + size : "") +
                        (className ? " " + className : "")
                    }
                >
                    {alteredChildren}
                </section>
            </div>
        </BlueprintOverlay>
    );
};

export default Modal;
