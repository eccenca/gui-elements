import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export type OverviewItemDescriptionProps = React.HTMLAttributes<HTMLDivElement>;

export const OverviewItemDescription = ({
    children,
    className = "",
    ...otherDivProps
}: OverviewItemDescriptionProps) => {
    return (
        <div
            {...otherDivProps}
            className={cn(
                `${eccgui}-overviewitem__description`,
                // spacing to a preceding depiction sibling is handled by `gap-2` on the parent OverviewItem
                "flex grow shrink flex-col content-stretch items-stretch justify-start overflow-hidden",
                className,
            )}
        >
            {children}
        </div>
    );
};

export default OverviewItemDescription;
