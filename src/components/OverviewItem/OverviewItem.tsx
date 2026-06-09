import React from "react";

import { intentClassName, IntentTypes } from "../../common/Intent";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Card, { CardProps } from "../Card/Card";

export interface OverviewItemProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Visual intent state.
     */
    intent?: IntentTypes;
    /**
     * Displays the element using reduced height and less white space inside.
     */
    densityHigh?: boolean;
    /**
     * Add a bit white space around the element.
     */
    hasSpacing?: boolean;
    /**
     * Add a border around the element.
     * On default the background uses the default color from the `Card`.
     * Otherwise, color is managed automatically by the intent state.
     */
    hasBorder?: boolean;
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
    hasBorder = false,
    hasCardWrapper = false,
    cardProps,
    intent,
    ...otherProps
}: OverviewItemProps) => {
    const item = (
        <div
            {...otherProps}
            className={
                `${eccgui}-overviewitem__item ` +
                (densityHigh ? `${eccgui}-overviewitem__item--highdensity ` : "") +
                (hasSpacing ? `${eccgui}-overviewitem__item--hasspacing ` : "") +
                (hasBorder ? `${eccgui}-overviewitem__item--hasborder ` : "") +
                (intent ? `${intentClassName(intent)} ` : "") +
                className
            }
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
