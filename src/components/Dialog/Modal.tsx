/*
    we only use Dialog as pre-configured and enhanced Overlay, it is
    recommended to use Card elements inside.
*/

import React from 'react';
import { Classes as BlueprintClassNames, Overlay as BlueprintOverlay, } from "@blueprintjs/core";
import { Card } from "./../Card";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function Modal({
    children,
    className='',
    overlayClassName='',
    size="regular", // tiny, small, regular, large, fullscreen
    canOutsideClickClose=false,
    canEscapeKeyClose=false,
    preventBackdrop=false,
    ...otherProps
}: any) {

    const alteredChildren = React.Children.map(children, (child, index) => {
        if (child.type === Card) {
            return React.cloneElement(
                child,
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
