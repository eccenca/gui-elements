import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Card, { CardProps } from "../Card/Card";

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
                // fixed row height, `mini-units(6)` (3rem) normally, BlueprintJS button height (30px, a flat non-rem value) when densityHigh
                densityHigh ? "min-h-[30px] max-h-[30px]" : "min-h-12 max-h-12",
                // outer whitespace: content-box normally so padding adds to the fixed height, border-box when densityHigh also
                // shrinks the row so the (self-stretching) depiction shrinks together with it - see OverviewItemDepiction
                hasSpacing && (densityHigh ? "box-border" : "box-content"),
                hasSpacing && "p-1",
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
