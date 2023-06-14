import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface OverviewItemProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Displays the element using reduced height and less white space inside.
     */
    densityHigh?: boolean;
    /**
     * Add a bit white space around the element.
     */
    hasSpacing?: boolean;
}

/**
 * This element can include all basic information and actions to give an overview about the item.
 * Mainly used in items list or to create basic widgets.
 */
function OverviewItem({
    children,
    className = '',
    densityHigh = false,
    hasSpacing = false,
    ...otherProps
}: OverviewItemProps) {

    const item = (
        <div
            {...otherProps}
            className={
                `${eccgui}-overviewitem__item ` +
                (densityHigh ? `${eccgui}-overviewitem__item--highdensity ` : '') +
                (hasSpacing ? `${eccgui}-overviewitem__item--hasspacing ` : '') +
                className
            }
        >
            {children}
        </div>
    );

    let accessibilityParameters:  { [key: string]: any; } = Object.create(null);
    if (
        typeof otherProps.onClick !== 'undefined' ||
        typeof otherProps.onKeyDown !== 'undefined'
    ) {
        accessibilityParameters['tabIndex'] = 0;
    }
    if (
        typeof otherProps.onClick !== 'undefined' &&
        typeof otherProps.onKeyDown !== 'undefined'
    ) {
        accessibilityParameters['role'] = "button";
    }

    return React.cloneElement(
            item,
            accessibilityParameters
    );
}

export default OverviewItem;
