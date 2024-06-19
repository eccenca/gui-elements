import React, { CSSProperties } from "react";

import { utils } from "../../common/";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface StickyTargetProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Set the side the element need to be sticky on.
     */
    to?: "top" | "bottom";
    /**
     * The sticky area is positioned relatively to a local scroll area.
     * The application header is not taken into offset calculation
     */
    local?: boolean;
    /**
     * Set additional distance to original sticky position.
     */
    offset?: `${number}${string}`;
    /**
     * Set the background color used for the sticky area.
     * As it can overlay other content readability could be harmed if the overlayed content is shining through.
     */
    background?: "card" | "application" | "transparent";
    /**
     * In some situations there could be a gap between sticky target area and the border of the related scroll area.
     * The main gap is the gap towards the direction of the sticky behaviour, specified by `to`.
     * You can fill this gap with a gradient or full background color.
     */
    fillMainGap?: "full" | "gradient";
    /**
     * The secondary gap is the gap against the direction of the sticky behaviour.
     * So in case of `to="top"` this is rendered on the bottom of the sticky area.
     */
    fillSecondaryGap?: "full" | "gradient";
    /**
     * Callback that returns an DOM element.
     * The position of `StickyTarget` is then calculated relative to that element.
     */
    getConnectedElement?: (ref: React.MutableRefObject<HTMLDivElement | null>) => Element | false;
}

/**
 * Element wraps the content that need to be displayed sticky.
 * The content then offset relative to its nearest scrolling ancestor and containing block (nearest block-level ancestor).
 */
export const StickyTarget = ({
    className,
    to = "top",
    local = false,
    offset,
    background = "transparent",
    fillMainGap,
    fillSecondaryGap,
    style,
    getConnectedElement,
    ...otherDivProps
}: StickyTargetProps) => {
    const stickyTargetRef = React.useRef<HTMLDivElement | null>(null);

    let offsetStyle = {};
    if (typeof offset !== "undefined") {
        offsetStyle = { ...style, "--eccgui-sticky-target-localoffset": offset } as CSSProperties;
    }

    React.useEffect(() => {
        let removeEventForConnectedOffset = () => {
            /* no event need to be removed */
        };
        let removeEventForStickynessCheck = () => {
            /* no event need to be removed */
        };
        /**
         * If the target should be sticky to a defined element then:
         * * check for the element and its scroll parent
         * * listen to scroll events and use the elements position as offset
         */
        if (getConnectedElement && stickyTargetRef) {
            const stickyConnection = getConnectedElement(stickyTargetRef);
            if (stickyConnection) {
                const scrollParent = utils.getScrollParent(stickyConnection);
                const scrollParentFallback = !scrollParent ? document.documentElement : false;
                if (scrollParent || scrollParentFallback) {
                    const updateTargetOffset = () => {
                        let connectedOffset = 0;
                        const scrollParentPosition = (
                            (scrollParent || scrollParentFallback) as HTMLElement
                        ).getBoundingClientRect();
                        const stickyConnectionPosition = stickyConnection.getBoundingClientRect();
                        if (to === "top") {
                            connectedOffset =
                                stickyConnectionPosition.top -
                                Math.max(0, scrollParentPosition.top) +
                                stickyConnectionPosition.height;
                        }
                        if (to === "bottom") {
                            connectedOffset =
                                Math.max(scrollParentPosition.height, scrollParentPosition.bottom) -
                                stickyConnectionPosition.bottom +
                                stickyConnectionPosition.height;
                        }
                        stickyTargetRef.current?.style.setProperty(
                            "--eccgui-sticky-target-applicationoffset",
                            `${connectedOffset}px`
                        );
                    };

                    updateTargetOffset();
                    const eventListeningTarget = scrollParent || window;
                    const eventListeningMethod = (_event: Event) => {
                        updateTargetOffset();
                    };
                    eventListeningTarget.addEventListener("scroll", eventListeningMethod);
                    removeEventForConnectedOffset = () => {
                        eventListeningTarget.removeEventListener("scroll", eventListeningMethod);
                    };
                }
            }
        }
        /**
         * Check if sticky target element is currently in sticky mode.
         * sticky mode = current position === defined sticky position
         */
        if (stickyTargetRef && (fillMainGap || fillSecondaryGap)) {
            const stickyTarget = stickyTargetRef.current as Element;
            const scrollParent = utils.getScrollParent(stickyTarget);
            const checkStickyness = () => {
                const definedPosition = parseInt(window.getComputedStyle(stickyTarget)[to], 10);
                const scrollParentPosition = scrollParent ? scrollParent.getBoundingClientRect()[to] : 0;
                const currentPosition =
                    (to === "top" ? 1 : -1) * (stickyTarget.getBoundingClientRect()[to] - scrollParentPosition);
                // check stickyness in a small position range (not exact value) because of float values
                const isSticky = currentPosition <= definedPosition + 1 && currentPosition >= definedPosition - 1;
                if (isSticky && !stickyTarget.classList.contains(`${eccgui}-sticky__target--issticky`)) {
                    stickyTarget.classList.add(`${eccgui}-sticky__target--issticky`);
                }
                if (!isSticky && stickyTarget.classList.contains(`${eccgui}-sticky__target--issticky`)) {
                    stickyTarget.classList.remove(`${eccgui}-sticky__target--issticky`);
                }
            };
            checkStickyness();
            const eventListeningTarget = scrollParent || window;
            const eventListeningMethod = (_event: Event) => {
                checkStickyness();
            };
            eventListeningTarget.addEventListener("scroll", eventListeningMethod);
            removeEventForStickynessCheck = () => {
                eventListeningTarget.removeEventListener("scroll", eventListeningMethod);
            };
        }
        return () => {
            removeEventForConnectedOffset();
            removeEventForStickynessCheck();
        };
    }, [getConnectedElement, stickyTargetRef, to, fillMainGap, fillSecondaryGap]);

    return (
        <div
            ref={stickyTargetRef}
            className={
                `${eccgui}-sticky__target` +
                (to ? ` ${eccgui}-sticky__target--${to}` : "") +
                (local ? ` ${eccgui}-sticky__target--localscrollarea` : "") +
                (background ? ` ${eccgui}-sticky__target--bg-${background}` : "") +
                (fillMainGap ? ` ${eccgui}-sticky__target--maingapfill-${fillMainGap}` : "") +
                (fillSecondaryGap ? ` ${eccgui}-sticky__target--secondarygapfill-${fillSecondaryGap}` : "") +
                (className ? ` ${className}` : "")
            }
            style={offset ? offsetStyle : style}
            {...otherDivProps}
        />
    );
};

export default StickyTarget;
