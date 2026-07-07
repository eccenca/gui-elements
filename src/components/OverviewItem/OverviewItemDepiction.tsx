import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { Depiction } from "./../Depiction/Depiction";
import Icon from "./../Icon/Icon";
import TestIcon from "./../Icon/TestIcon";

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
                // `self-stretch` + `aspect-square`: sizes itself off the (flex) parent OverviewItem's current row height -
                // this reproduces the original fixed `mini-units(6)`/`$button-height`/`$button-height - spacing` sizes
                // for the normal/densityHigh/densityHigh+hasSpacing cases alike, without needing to know the parent's props
                "flex flex-none aspect-square self-stretch content-center items-center overflow-hidden text-center rounded-[2px] print:[print-color-adjust:exact]",
                "[&>*]:mx-auto [&>*]:block [&>*]:max-w-full [&>*]:max-h-full [&>*]:object-contain",
                // by default the SVG depictions are displayed light on dark color, `keepColors` prevents it
                !keepColors && "bg-foreground text-background [&_svg]:fill-background",
                className,
            )}
        >
            {children}
        </div>
    );
};

export default OverviewItemDepiction;
