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
     * Set the background color used for the sticky area.
     * As it can overlay other content readability could be harmed if the overlayed content is shining through.
     */
    background?: "card" | "application" | "transparent";
    /**
     * Set additional distance to original sticky position.
     */
    offset?: `${number}${string}`;
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
    background = "transparent",
    offset,
    style,
    getConnectedElement,
    ...otherDivProps
}: StickyTargetProps) => {
    const stickyTargetRef = React.useRef<HTMLDivElement | null>(null);

    let offsetStyle = {};
    if (typeof offset !== "undefined") {
        offsetStyle = { ...style, "--eccgui-sticky-target-localoffset": offset } as CSSProperties;
    }

    let connectedOffset = 0;
    React.useEffect(() => {
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
                    (scrollParent || window).addEventListener("scroll", (_event) => {
                        updateTargetOffset();
                    });
                }
            }
        }
    }, [getConnectedElement, stickyTargetRef, to]);

    return (
        <div
            ref={stickyTargetRef}
            className={
                `${eccgui}-sticky__target` +
                (to ? ` ${eccgui}-sticky__target--${to}` : "") +
                (local ? ` ${eccgui}-sticky__target--localscrollarea` : "") +
                (background ? ` ${eccgui}-sticky__target--bg-${background}` : "") +
                (className ? ` ${className}` : "")
            }
            style={offset ? offsetStyle : style}
            {...otherDivProps}
        />
    );
};

export default StickyTarget;
