import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface FieldItemRowProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * If set to `true` all `FieldItem` childrens have the same width.
     */
    justifyItemWidths?: boolean;
}

/**
 * Allows to display `FieldItem` children horizontally in one row.
 */
function FieldItemRow({
    children,
    className,
    justifyItemWidths = false,
    ...otherProps
}: FieldItemRowProps) {
    return (
        <div
            className={
                `${eccgui}-fielditem__row` +
                (justifyItemWidths ? ` ${eccgui}-fielditem__row--justified` : "") +
                (className ? ` ${className}` : "")
            }
            {...otherProps}
        >
            {children}
        </div>
    );
}

export default FieldItemRow;
