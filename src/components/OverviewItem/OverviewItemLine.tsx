import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface OverviewItemLineProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Use it with a small font size.
     */
    small?: boolean;
    /**
     * Use it with a large font size.
     */
    large?: boolean;
}

/**
 * Contains content of a single line in an `OverviewItemDescription` element.
 * It is limited to one line only, text is not broken to multiple lines on white spaces.
 * If the content overflows the container then this part of the content is hidden.
 * It does not make sense to include more that 2 or 3 of those lines within one `OverviewItemDescription`.
 */
export const OverviewItemLine = ({
    children,
    className = "",
    small = false,
    large = false,
    ...restProps
}: OverviewItemLineProps) => {
    return (
        <div
            {...restProps}
            className={cn(
                `${eccgui}-overviewitem__line`,
                small && `${eccgui}-overviewitem__line--small`,
                large && `${eccgui}-overviewitem__line--large`,
                "flex flex-[1_1_100%] items-center overflow-hidden whitespace-nowrap",
                "[&>*]:inline-block [&>*]:max-w-full [&>*]:text-[inherit]",
                // font-size/line-height pairs translated from `$eccgui-size-typo-caption`/`-subtitle` (see `_variables.scss`);
                // `large` wins if both are set, matching the original cascade order (`--large` declared after `--small`)
                large ? "text-[16.33px]/[1.19]" : small ? "text-[12px]/[1.62]" : "text-[1rem]",
                className,
            )}
        >
            {children}
        </div>
    );
};

export default OverviewItemLine;
