import React from "react";
import { CarbonIconProps,CarbonIconType } from "@carbon/react/icons";

export const transform = (IconSymbol: CarbonIconType, rotate: number = 0, flipH: boolean = false, flipV: boolean = false) : CarbonIconType => {
    return React.forwardRef((props: CarbonIconProps, ref: React.ForwardedRef<React.ReactSVGElement>) => {
        return (
            <IconSymbol
                {...props}
                ref={ref}
                transform={
                    `scale(${flipH ? "-1" : "1"}, ${flipV ? "-1" : "1"}) rotate(${rotate})`
                }
            />
        );
    })
}

