import React from "react";
import { createPortal } from "react-dom";
import { createPopper } from "@popperjs/core";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { ContextOverlayProps } from "../ContextOverlay";
import { TestableComponent } from "../interfaces";
import { tooltipSizeMaxWidthClass, TooltipSize } from "../Tooltip/Tooltip";
import WhiteSpaceContainer from "../Typography/WhiteSpaceContainer";

// former `.eccgui-decoupled-overlay__arrow` rules (`_decoupledoverlay.scss`): a 30x30 hit box
// whose `::before` paints the visible 20x20 diamond (inset 5px on every side), popper.js sets
// `data-popper-placement` on the root element (the `group/decoupled` below) once positioned, so
// the arrow nudges itself half out of the card on the side facing the target.
const decoupledOverlayArrowClasses =
    "absolute size-[30px] " +
    "before:absolute before:inset-[5px] before:block before:content-[''] before:rounded-[2px] " +
    "before:bg-popover before:rotate-45 before:shadow-[1px_1px_6px_color-mix(in_oklab,var(--foreground)_20%,transparent)] " +
    "group-data-[popper-placement=top]/decoupled:bottom-[-7px] " +
    "group-data-[popper-placement=right]/decoupled:left-[-7px] " +
    "group-data-[popper-placement=bottom]/decoupled:top-[-7px] " +
    "group-data-[popper-placement=left]/decoupled:right-[-7px]";

export interface DecoupledOverlayProps
    extends
        React.HTMLAttributes<HTMLDivElement>,
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
        [targetSelectorOrElement],
    );

    const overlay = (
        <div
            className={cn(
                `${eccgui}-decoupled-overlay`,
                `${eccgui}-decoupled-overlay--${size}`,
                minimal && `${eccgui}-decoupled-overlay--minimal`,
                // `group/decoupled` lets the arrow below react to the `data-popper-placement`
                // popper.js sets on this very element; `inline-block` + stacking level and the
                // size cap are former `.eccgui-decoupled-overlay` rules (`_decoupledoverlay.scss`).
                "group/decoupled inline-block",
                tooltipSizeMaxWidthClass[size],
                // card look of the (Radix-based) `ContextOverlay` content recipe. `border-border` is
                // required alongside the bare `border` utility: this project's preflight resets
                // `border-color` to its CSS-initial `currentcolor` (no global reset backs it here, see
                // `src/tailwind/base.css`), so a bare `border` would otherwise pick up
                // `text-popover-foreground` as its color instead of the pale `--border` hairline.
                "rounded-md border border-border bg-popover text-popover-foreground shadow-md",
            )}
            role="tooltip"
            ref={overlayRef}
            style={{ zIndex: "var(--eccgui-zindex-modals, 8001)" as unknown as number }}
        >
            {!minimal && (
                <div className={cn(`${eccgui}-decoupled-overlay__arrow`, decoupledOverlayArrowClasses)} data-popper-arrow aria-hidden />
            )}
            <div
                className={cn(
                    `${eccgui}-decoupled-overlay__content`,
                    // `position: relative` so this pane paints above the inner half of the arrow
                    // square; the matching `bg-popover` covers it (only the outward-pointing tip
                    // of the arrow diamond remains visible past this pane's own edge).
                    "relative rounded-[inherit] bg-popover p-[0.1px]",
                    !minimal && "min-h-[30px]",
                )}
            >
                {paddingSize ? (
                    <WhiteSpaceContainer
                        paddingTop={paddingSize}
                        paddingRight={paddingSize}
                        paddingBottom={paddingSize}
                        paddingLeft={paddingSize}
                    >
                        {children}
                    </WhiteSpaceContainer>
                ) : (
                    children
                )}
            </div>
        </div>
    );

    return usePortal ? createPortal(overlay, portalContainer) : overlay;
};

export default DecoupledOverlay;
