import React from "react";

import { cn } from "@/common/utils/cn";

import { SKELETON } from "./classnames";

export interface SkeletonProps {
    /**
     * Element that need to displayed using the skeleton styles.
     */
    children: React.JSX.Element | React.JSX.Element[];
}

/**
 * Tailwind utility classes that turn an element into a pulsing, neutral loading placeholder
 * that hides its own (and its children's) real content. Applied in addition to the legacy
 * `SKELETON` classname (see `./classnames`), which is kept for backward compatibility but no
 * longer carries any styling of its own.
 */
const SKELETON_UTILITY_CLASSES =
    "animate-pulse cursor-default select-none rounded-md bg-muted text-transparent shadow-none pointer-events-none [&_*]:invisible before:invisible after:invisible";

/**
 * `<Skeleton />` provides a loading state display of its children elements.
 * It does not provide its own content.
 */
export function Skeleton({ children }: SkeletonProps) {
    const alteredChildren = React.Children.map(children, (child) => {
        const originalChild = child;
        if (originalChild.props) {
            return React.cloneElement(originalChild, {
                className: cn(originalChild.props.className, SKELETON, SKELETON_UTILITY_CLASSES),
                // @see https://blueprintjs.com/docs/versions/4/#core/components/skeleton
                disabled: true,
                tabIndex: -1,
            });
        }
        return originalChild;
    });
    return <>{alteredChildren}</>;
}

export default Skeleton;
