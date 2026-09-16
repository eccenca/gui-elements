import React from "react";
import {
    Classes as BlueprintClassNames,
    DialogProps as BlueprintDialogProps,
    Overlay2 as BlueprintOverlay,
    Overlay2Props as BlueprintOverlayProps,
} from "@blueprintjs/core";

import { preventReactFlowActionsClasses } from "../../cmem/react-flow/ReactFlow/constants";
import { utils } from "../../common";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { TestableComponent } from "../interfaces";

import { Card } from "./../Card";
import { ModalContext } from "./ModalContext";

export interface ModalProps
    extends
        TestableComponent,
        BlueprintOverlayProps,
        Pick<BlueprintDialogProps, "role" | "aria-labelledby" | "aria-describedby"> {
    children: React.ReactNode | React.ReactNode[];
    /**
     * A space-delimited list of class names to pass along to the BlueprintJS `Overlay` element that is used to create the modal.
     */
    overlayClassName?: string;
    /**
     * Size of the modal.
     */
    size?: ModalSize;
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
    /**
     * Modal ID that should be globally unique. If a ModalContext is provided this can be used to track opening/closing of this modal.
     */
    modalId?: string;
    /**
     * Prevents that pan and zooming actions of an existing react-flow instance are triggered while this Modal is open.
     */
    preventReactFlowEvents?: boolean;
    /**
     * Set this if there is no visible title element that is used for `aria-labelledby`.
     */
    "aria-label"?: string;
}

export type ModalSize = "tiny" | "small" | "regular" | "large" | "xlarge" | "fullscreen";

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
    "data-test-id": dataTestId,
    "data-testid": dataTestid,
    modalId,
    role = "dialog",
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
    "aria-label": ariaLabel,
    preventReactFlowEvents = true,
    ...otherProps
}: ModalProps) => {
    const modalContext = React.useContext(ModalContext);
    const uniqueModalId = React.useRef<string>(
        modalId ?? Date.now().toString(36) + Math.random().toString(36).substring(2),
    );

    React.useEffect(() => {
        return () => {
            // Make sure to always remove flag when modal is removed
            modalContext.setModalOpen(uniqueModalId.current, false);
        };
    }, []);

    React.useEffect(() => {
        if (!(ariaLabel || ariaLabelledby || ariaDescribedby) && role && otherProps.isOpen) {
            // eslint-disable-next-line no-console
            console.warn(`role=${role} removed from modal because no label or description is available.`);
        }
        modalContext.setModalOpen(uniqueModalId.current, otherProps.isOpen);
    }, [otherProps.isOpen]);

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
            const highestTopIndex = (utils.getGlobalVar("highestModalTopIndex") as unknown as number) ?? 0;
            if (parentalPortal) {
                const portalTopIndex = parseInt(getComputedStyle(parentalPortal).zIndex ?? 0, 10);
                const newTopIndex = Math.max(portalTopIndex, highestTopIndex) + 1;
                parentalPortal.style.zIndex = `${newTopIndex}`;
                utils.setGlobalVar("highestModalTopIndex", newTopIndex);
            }
        }
    };

    // always remove the role if there is no explanation
    const modalRole = ariaLabel || ariaLabelledby || ariaDescribedby ? role : undefined;

    // Only the modal that was opened last constrains assistive technologies to its contents.
    // Without a provided ModalContext the stack always stays empty, then no modal claims modality.
    const openModalStack = modalContext.openModalStack() ?? [];
    const isTopMostModal = openModalStack[openModalStack.length - 1] === uniqueModalId.current;

    const modalAriaAttributes = {
        role: modalRole,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledby,
        "aria-describedby": ariaDescribedby,
        // modality can only be expressed together with a dialog role
        "aria-modal": modalRole ? isTopMostModal : undefined,
    };

    return (
        <BlueprintOverlay
            {...otherProps}
            backdropProps={backdropProps}
            className={`${overlayClassName} ${preventReactFlowEvents ? preventReactFlowActionsClasses : ""}`}
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
                {...{ "data-test-id": dataTestId ?? "simpleDialogWidget", "data-testid": dataTestid }}
                tabIndex={0}
                {...focusableProps}
            >
                <section
                    className={
                        `${eccgui}-dialog__wrapper` +
                        (typeof size === "string" ? ` ${eccgui}-dialog__wrapper--` + size : "") +
                        (className ? " " + className : "")
                    }
                    {...modalAriaAttributes}
                >
                    {alteredChildren}
                </section>
            </div>
        </BlueprintOverlay>
    );
};

export default Modal;
