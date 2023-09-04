import React from 'react';
import {
    Classes as BlueprintClassNames,
    IOverlayState,
    Overlay as BlueprintOverlay,
    OverlayProps,
} from "@blueprintjs/core";
import {Card} from "./../Card";
import {CLASSPREFIX as eccgui} from "../../configuration/constants";

export interface ModalProps extends OverlayProps, IOverlayState {
  children: React.ReactNode | React.ReactNode[];
  /**
   * A space-delimited list of class names to pass along to the BlueprintJS `Overlay` element that is used to create the modal.
   */
  overlayClassName?: string;
  /**
   * Size of the modal.
   */
  size?: "tiny" | "small" | "regular" | "large" | "fullscreen";
  /**
   * Prevents that a backdrop area is displayed behind the modal elements.
   */
  preventBackdrop?: boolean;
    /** Optional props for the wrapper div element inside the modal overlay. */
  wrapperDivProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
}

/**
 * Displays contents on top of other elements, used to create dialogs.
 * For most situations the usage of `SimpleDialog` and `AlertDialog` should be sufficent.
 * Otherwise this element can be used to create own modal elements and edge cases for modal dialogs.
 * Then it is recommended to use the `Card` element inside.
 */
export const Modal = ({
    children,
    className='',
    overlayClassName='',
    size="regular",
    canOutsideClickClose=false,
    canEscapeKeyClose=false,
    preventBackdrop=false,
    wrapperDivProps,
    ...otherProps
}: ModalProps) => {
    const alteredChildren = React.Children.map(children, (child) => {
        if ((child as React.ReactElement).type && (child  as React.ReactElement).type === Card) {
            return React.cloneElement(
                child as React.ReactElement,
                {
                    isOnlyLayout: true,
                    elevation: 4
                }
            );
        }

        return child;
    });

    return (
        <BlueprintOverlay
            {...otherProps}
            className={overlayClassName}
            backdropClassName={`${eccgui}-dialog__backdrop`}
            canOutsideClickClose={canOutsideClickClose}
            canEscapeKeyClose={canEscapeKeyClose}
            hasBackdrop={!preventBackdrop}
        >
            <div
                {...wrapperDivProps}
                className={BlueprintClassNames.DIALOG_CONTAINER}
                // this is a workaround because data attribute on SimpleDialog is not correctly routed to the overlay by blueprint js
                data-test-id={(otherProps as any)["data-test-id"] ?? "simpleDialogWidget"}
                tabIndex={0}
            >
                <section
                    className={
                        `${eccgui}-dialog__wrapper` +
                        (typeof size === 'string' ? ` ${eccgui}-dialog__wrapper--` + size : '') +
                        (className ? ' ' + className : '')
                    }
                >
                    {alteredChildren}
                </section>
            </div>
        </BlueprintOverlay>
    );
}

export default Modal;
