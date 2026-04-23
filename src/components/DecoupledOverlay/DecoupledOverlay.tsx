import React from "react";
import { createPortal } from "react-dom";
import { Classes as BlueprintClasses } from "@blueprintjs/core";
import { createPopper } from "@popperjs/core";
import {TooltipSize} from "../Tooltip/Tooltip";
import {TestableComponent} from "../interfaces";
import {ContextOverlayProps} from "../ContextOverlay";
import {CLASSPREFIX as eccgui} from "../../configuration/constants";
import WhiteSpaceContainer from "../Typography/WhiteSpaceContainer";

export interface DecoupledOverlayProps
    extends React.HTMLAttributes<HTMLDivElement>,
        TestableComponent,
        Pick<ContextOverlayProps, "usePortal" | "portalContainer" | "placement" | "minimal" | "paddingSize"> {
    /**
     * Element that should be used. The step content is displayed as a tooltip instead of a modal.
     * In case of an array, the first match is highlighted. */
    targetSelectorOrElement: string | Element;
    /**
     * The size of the overlay.
     * */
    size?: TooltipSize;
}

/**
 * Use an overlay popover without the necessity to use a target that need to be rendered in place.
 * The target is referenced by a selector string or element object.
 * It can exist somewhere in the DOM, but it must exist when the overlay is rendered.
 * It is always displayed, close it by removement.
 */
export const DecoupledOverlay = ({
    targetSelectorOrElement,
    usePortal = true,
    portalContainer = document.body,
    minimal = false,
    placement = "auto",
    size = "large",
    paddingSize,
    children,
}: DecoupledOverlayProps) => {
    const overlayRef = React.useCallback(
        (overlay: HTMLDivElement | null) => {
            const target =
                typeof targetSelectorOrElement === "string"
                    ? document.querySelector(targetSelectorOrElement)
                    : targetSelectorOrElement;
            if (overlay && target) {
                createPopper(target, overlay, {
                    placement: placement,
                    modifiers: [
                        {
                            name: "offset",
                            options: {
                                offset: [0, 15],
                            },
                        },
                    ],
                });
            }
        },
        [targetSelectorOrElement]
    );

    const overlay = (
        <div
            className={
                `${eccgui}-decoupled-overlay` +
                ` ${eccgui}-decoupled-overlay--${size}` +
                ` ${BlueprintClasses.POPOVER}` +
                (minimal ? ` ${BlueprintClasses.MINIMAL}` : "")
            }
            role="tooltip"
            ref={overlayRef}
        >
            {!minimal && (
                <div
                    className={`${eccgui}-decoupled-overlay__arrow ${BlueprintClasses.POPOVER_ARROW}`}
                    data-popper-arrow
                    aria-hidden
                />
            )}
            <div className={`${BlueprintClasses.POPOVER_CONTENT} ${eccgui}-decoupled-overlay__content`}>
                {paddingSize ? (
                    <WhiteSpaceContainer
                        paddingTop={paddingSize}
                        paddingRight={paddingSize}
                        paddingBottom={paddingSize}
                        paddingLeft={paddingSize}
                    >
                        {children}
                    </WhiteSpaceContainer>
                ) : children}
            </div>
        </div>
    );

    return usePortal ? createPortal(overlay, portalContainer) : overlay;
};

export default DecoupledOverlay;
