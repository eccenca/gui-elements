import React from "react";

import { IconComponentType } from "./canonicalIconNames";

/**
 * Wraps an icon component so it renders with an additional SVG `transform` (a rotation and/or a
 * horizontal/vertical flip). Returns a forward-ref SVG component compatible with `BaseIcon`.
 */
export const transform = (
    IconSymbol: IconComponentType,
    rotate: number = 0,
    flipH: boolean = false,
    flipV: boolean = false,
): IconComponentType => {
    const IconComponentNamed = IconSymbol as React.ElementType;
    return React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(function TransformedIcon(props, ref) {
        return (
            <IconComponentNamed
                {...props}
                ref={ref}
                transform={`scale(${flipH ? "-1" : "1"}, ${flipV ? "-1" : "1"}) rotate(${rotate})`}
            />
        );
    }) as IconComponentType;
};
