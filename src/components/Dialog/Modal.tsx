/*
    we only use Dialog as pre-configured and enhanced Overlay, it is
    recommended to use Card elements inside.
*/

import React from 'react';
import {Classes as BlueprintClassNames, IOverlayProps, Overlay as BlueprintOverlay,} from "@blueprintjs/core";
import {Card} from "./../Card";
import {CLASSPREFIX as eccgui} from "../../configuration/constants";
import {IOverlayState} from "@blueprintjs/core/lib/esm/components/overlay/overlay";

export interface IModalProps extends IOverlayProps, IOverlayState {
    children: React.ReactElement | React.ReactElement[] | React.ReactText
    overlayClassName?: string
    size?: "tiny" | "small" | "regular" | "large" | "fullscreen"
    preventBackdrop?: boolean
}

function Modal({
    children,
    className='',
    overlayClassName='',
    size="regular",
    canOutsideClickClose=false,
    canEscapeKeyClose=false,
    preventBackdrop=false,
    ...otherProps
}: IModalProps) {

    const alteredChildren = React.Children.map(children, (child, index) => {
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
            className={
                overlayClassName
            }
            backdropClassName={`${eccgui}-dialog__backdrop`}
            canOutsideClickClose={canOutsideClickClose}
            canEscapeKeyClose={canEscapeKeyClose}
            hasBackdrop={!preventBackdrop}
        >
            <div className={BlueprintClassNames.DIALOG_CONTAINER}>
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
