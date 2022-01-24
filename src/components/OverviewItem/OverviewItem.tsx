import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface OverviewItemProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode
    className?: string;
    // Todo not sure of this description
    /**
     * when set to true will reduce the dimensions when make the elements contained with packed 
     */
    densityHigh?: boolean;
    /**
     * when set to true will add margins to both the left and right. 
     */
    hasSpacing?: boolean;
}

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

    let accessibilityParameters = {};
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
