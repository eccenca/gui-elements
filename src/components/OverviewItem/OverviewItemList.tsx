import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function OverviewItemList({
    children,
    className = '',
    densityHigh = false,
    hasDivider = false,
    hasSpacing = false,
    columns=1,
    ...restProps
}: any) {
    return (
        <ol
            {...restProps}
            className={
                `${eccgui}-overviewitem__list ` +
                (densityHigh ? `${eccgui}-overviewitem__list--highdensity ` : '') +
                (hasDivider ? `${eccgui}-overviewitem__list--hasdivider ` : '') +
                (hasSpacing ? `${eccgui}-overviewitem__list--hasspacing ` : '') +
                (columns > 1 ? `${eccgui}-overviewitem__list--hascolumns ` : '') + // TODO: add number
                className
            }
        >
            {
                React.Children.map(children, (child, i) => {
                    return <li>{ child }</li>
                })
            }
        </ol>
    )
}

export default OverviewItemList;
