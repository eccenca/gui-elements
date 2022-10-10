import React, { useRef, useEffect } from "react";
// FIXME: re-evaluate if polyfill is necessary
// we currently need a polyfill for inert because Firefox do not support it natively atm
// @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert#browser_compatibility
import "wicg-inert";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Spinner, { SpinnerProps } from "./../Spinner/Spinner";

export interface InteractionGateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "inert"> {
    /**
     * Prevent interaction with sub elements and narrow them in their visibility.
     */
    inert?: boolean;
    /**
     * Displays a spinner centered over the sub element.
     */
    showSpinner?: boolean;
    /**
     * Configure the included `<Spinner />` element.
     */
    spinnerProps?: SpinnerProps;
}

/**
 * Wrap content that need to be blocked from user interactions
 * It also has options to display a spinner as overlay.
 */
function InteractionGate({
    children,
    className,
    inert = false,
    showSpinner = false,
    spinnerProps = {},
    ...otherProps
}: InteractionGateProps) {
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // we currently cannot add inert property directly to the div because react types module seem not to know it
        if (inert) {
            domRef.current!.setAttribute('inert', '');
        } else {
            domRef.current!.removeAttribute('inert');
        }
    }, [inert]);

    return (
        <div className={`${eccgui}-interactiongate__wrapper`}>
            <div
                ref={domRef}
                className={
                    `${eccgui}-interactiongate` +
                    (inert ? ` ${eccgui}-interactiongate--inert` : "") +
                    (className ? ` ${className}` : "")
                }
                {...otherProps}
            >
                {children}
            </div>
            {showSpinner && <Spinner showLocalBackdrop={true} {...spinnerProps} className={`${eccgui}-interactiongate__spinner`} />}
        </div>
    );
}

export default InteractionGate;
