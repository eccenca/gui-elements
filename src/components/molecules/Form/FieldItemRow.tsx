import React from "react";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

export interface FieldItemRowProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * If set to `true` all `FieldItem` childrens have the same width.
     */
    justifyItemWidths?: boolean;
}

/**
 * Allows to display `FieldItem` children horizontally in one row.
 */
export const FieldItemRow = ({ children, className, justifyItemWidths = false, ...otherProps }: FieldItemRowProps) => {
    return (
        <div
            className={cn(
                `${eccgui}-fielditem__row`,
                "flex flex-row flex-nowrap items-end justify-start -mx-2 [&:not(:last-child)]:mb-4",
                // Targets `FieldItem`'s own root classname on direct children - hardcoded literal
                // (not built from the `eccgui` template var) since Tailwind's class extractor only
                // picks up arbitrary-variant selectors that appear as static text (see the `bp6-control`
                // precedent in `Toolbar.tsx`/`ToolbarSection.tsx`).
                "[&>.eccgui-fielditem]:mx-2 [&>.eccgui-fielditem]:grow [&>.eccgui-fielditem]:shrink",
                justifyItemWidths && `${eccgui}-fielditem__row--justified [&>.eccgui-fielditem]:w-full`,
                className,
            )}
            {...otherProps}
        >
            {children}
        </div>
    );
};

export default FieldItemRow;
