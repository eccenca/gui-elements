import React, { useEffect, useRef } from "react";

// FIXME: re-evaluate if polyfill is necessary
// we currently need a polyfill for inert because Firefox do not support it natively atm
// @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert#browser_compatibility
import "wicg-inert";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

import Spinner, { SpinnerProps } from "@/components/atoms/Spinner/Spinner";

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
    /**
     * Do not use own wrapper element to set the position of the spinner element, if used.
     * Use the positioning of the parent container.
     */
    useParentPositioning?: boolean;
}

/**
 * Wrap content that need to be blocked from user interactions
 * It also has options to display a spinner as overlay.
 */
export const InteractionGate = ({
    children,
    className,
    inert = false,
    showSpinner = false,
    spinnerProps = {},
    useParentPositioning = false,
    ...otherProps
}: InteractionGateProps) => {
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // we currently cannot add inert property directly to the div because react types module seem not to know it
        if (inert) {
            domRef.current!.setAttribute("inert", "");
        } else {
            domRef.current!.removeAttribute("inert");
        }
    }, [inert]);

    return (
        <div
            className={cn(
                // own positioning context for the overlay spinner, unless the parent already provides one
                !useParentPositioning && "relative",
                `${eccgui}-interactiongate__wrapper`,
                useParentPositioning && `${eccgui}-interactiongate__wrapper--tunnelpositioning`
            )}
        >
            <div
                ref={domRef}
                className={cn(
                    // dim the gated content while inert
                    inert && "opacity-50",
                    `${eccgui}-interactiongate`,
                    inert && `${eccgui}-interactiongate--inert`,
                    className
                )}
                {...otherProps}
            >
                {children}
            </div>
            {showSpinner && (
                <Spinner
                    showLocalBackdrop={true}
                    {...spinnerProps}
                    // while inert the content is already dimmed, so drop the spinner's own `bg-background/50`
                    // backdrop to avoid double-dimming (was `--inert + .spinner--localbackdrop { transparent }`)
                    className={cn(`${eccgui}-interactiongate__spinner`, inert && "bg-transparent")}
                />
            )}
        </div>
    );
};

export default InteractionGate;
