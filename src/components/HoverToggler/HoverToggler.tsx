import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface HoverTogglerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    /**
     * Additional CSS class name.
     */
    className?: string;
    /**
     * The content that is shown when not hovered.
     */
    baseContent: React.JSX.Element;
    baseContentProps?: Omit<React.HTMLAttributes<HTMLDivElement>, "children">;
    /**
     * The content that is shown when hovered.
     */
    hoverContent: React.JSX.Element;
    hoverContentProps?: Omit<React.HTMLAttributes<HTMLDivElement>, "children">;
    /**
     * Display as inline element.
     */
    inline?: boolean;
}

/** Displays a specific element. Displays another element when hovered. */
export const HoverToggler = ({
    className = "",
    baseContent,
    baseContentProps,
    hoverContent,
    hoverContentProps,
    inline = false,
    style,
    ...otherProps
}: HoverTogglerProps) => {
    // Order-slide toggler: a 200%-wide inner track holds two 50% panels, the overflow-hidden wrapper
    // shows one at a time. Base content sits first (order-1); on hover of the track (`group-hover`) or
    // when the hover panel takes focus (`focus-within`, for keyboard users) the hover panel jumps ahead
    // (order-0) and slides into view. Ported 1:1 from the former hovertoggler.scss.
    return (
        <div
            className={cn(
                "items-center justify-start overflow-hidden",
                inline ? "inline-flex w-auto" : "flex w-full",
                `${eccgui}-hovertoggler__wrapper`,
                inline && `${eccgui}-hovertoggler--inline`
            )}
            style={style}
        >
            <div
                className={cn(
                    "group w-[200%] shrink-0 items-stretch justify-start",
                    inline ? "inline-flex" : "flex",
                    `${eccgui}-hovertoggler`,
                    className
                )}
                {...otherProps}
            >
                <div
                    className={cn(
                        "order-1 flex w-1/2 shrink-0 grow-0 items-center justify-center overflow-hidden",
                        `${eccgui}-hovertoggler__basecontent`
                    )}
                >
                    <div className={`${eccgui}-hovertoggler__wrappercontent`} {...baseContentProps}>
                        {baseContent}
                    </div>
                </div>
                <div
                    className={cn(
                        "order-2 flex w-1/2 shrink-0 grow-0 items-center justify-center overflow-hidden",
                        "group-hover:order-none focus-within:order-none",
                        `${eccgui}-hovertoggler__hovercontent`
                    )}
                >
                    <div tabIndex={0} className={`${eccgui}-hovertoggler__wrappercontent`} {...hoverContentProps}>
                        {hoverContent}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HoverToggler;
