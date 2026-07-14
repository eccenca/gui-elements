import React from "react";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

import { Depiction } from "@/components/molecules/Depiction/Depiction";
import Icon from "@/components/atoms/Icon/Icon";
import TestIcon from "@/components/atoms/Icon/TestIcon";

export interface OverviewItemDepictionProps extends React.HTMLAttributes<HTMLDivElement> {
    // by default the SVG depictions are displayed light on dark color, this property prevents it
    keepColors?: boolean;
}

export const OverviewItemDepiction = ({
    children,
    className = "",
    keepColors = false,
    ...restProps
}: OverviewItemDepictionProps) => {
    const defaultDepictionDisplay = {
        // mimic OverviewItemDepiction "behaviour"
        border: false,
        backgroundColor: keepColors ? undefined : "dark",
        ratio: "1:1" as const,
        padding: "medium" as const,
    };
    // only return Depiction element if it is wrapped inside OverviewItemDepiction
    if (typeof children === "object" && !!children && "type" in children && children.type === Depiction) {
        return React.cloneElement(children, defaultDepictionDisplay);
    }
    // use Depiction element for basic icons
    if (
        typeof children === "object" &&
        !!children &&
        "type" in children &&
        (children.type === Icon || children.type === TestIcon)
    ) {
        return <Depiction image={children as React.JSX.Element} {...defaultDepictionDisplay} />;
    }
    return (
        <div
            {...restProps}
            className={cn(
                `${eccgui}-overviewitem__depiction`,
                keepColors && `${eccgui}-overviewitem__depiction--keepcolors`,
                // fixed 36px (`size-9`) tile, vertically centered in the (now natural-height) row via `self-center`
                // so a 2-line description no longer stretches it; `shrink-0` keeps it from being squeezed
                "flex size-9 shrink-0 self-center content-center items-center justify-center overflow-hidden rounded-md text-center print:[print-color-adjust:exact]",
                "[&>*]:mx-auto [&>*]:block [&>*]:max-w-full [&>*]:max-h-full [&>*]:object-contain",
                // soft muted tile (was an inverted dark tile); `keepColors` forces neither background nor foreground
                !keepColors && "bg-muted text-muted-foreground [&_svg]:fill-muted-foreground",
                className,
            )}
        >
            {children}
        </div>
    );
};

export default OverviewItemDepiction;
