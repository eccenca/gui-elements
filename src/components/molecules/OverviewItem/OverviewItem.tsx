import React from "react";

import { cn } from "@/common/utils/cn";
import Card, { CardProps } from "@/components/molecules/Card/Card";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

export interface OverviewItemProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Displays the element using reduced height and less white space inside.
     */
    densityHigh?: boolean;
    /**
     * Add a bit white space around the element.
     */
    hasSpacing?: boolean;
    /**
     * Uses a `Card` element to wrap the `OverviewItem` inside.
     * It is always used with `isOnlyLayout` set to `true`.
     * Should be used together with `hasSpacing`.
     */
    hasCardWrapper?: boolean;
    /**
     * Forwarding basic `Card` properties to the wrapper element.
     * Only used if `hasCardWrapper` is set to `true`.
     */
    cardProps?: Omit<CardProps, "children" | "isOnlyLayout" | "fullHeight" | "whitespaceAmount" | "compact">;
}

/**
 * This element can include all basic information and actions to give an overview about the item.
 * Mainly used in items list or to create basic widgets.
 */
export const OverviewItem = ({
    children,
    className = "",
    densityHigh = false,
    hasSpacing = false,
    hasCardWrapper = false,
    cardProps,
    ...otherProps
}: OverviewItemProps) => {
    const item = (
        <div
            {...otherProps}
            className={cn(
                `${eccgui}-overviewitem__item`,
                densityHigh && `${eccgui}-overviewitem__item--highdensity`,
                hasSpacing && `${eccgui}-overviewitem__item--hasspacing`,
                // layout: single-row flex box, children (depiction/description/actions) evenly gapped and stretched
                "group/overviewitem flex h-auto max-w-full flex-row flex-nowrap content-stretch items-stretch justify-start gap-2",
                // natural-height rows: a `min-h` floor only (never `max-h`), so a row grows with its content
                // (e.g. a 2-line description). `min-h-8` (2rem) when dense, `min-h-12` (3rem) otherwise.
                densityHigh ? "min-h-8" : "min-h-12",
                // always border-box; optional inner whitespace adds inside the row
                "box-border",
                hasSpacing && "p-2",
                // mirrors the original `&[tabindex]:not([tabindex="-1"])` rule - tabIndex is applied below via cloneElement
                '[&[tabindex]:not([tabindex="-1"])]:cursor-pointer',
                className,
            )}
        >
            {children}
        </div>
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const accessibilityParameters: { [key: string]: any } = Object.create(null);
    if (typeof otherProps.onClick !== "undefined" || typeof otherProps.onKeyDown !== "undefined") {
        accessibilityParameters["tabIndex"] = 0;
    }
    if (typeof otherProps.onClick !== "undefined" && typeof otherProps.onKeyDown !== "undefined") {
        accessibilityParameters["role"] = "button";
    }

    const element = React.cloneElement(item, accessibilityParameters);

    return hasCardWrapper ? (
        <Card isOnlyLayout {...cardProps}>
            {element}
        </Card>
    ) : (
        element
    );
};

export default OverviewItem;
