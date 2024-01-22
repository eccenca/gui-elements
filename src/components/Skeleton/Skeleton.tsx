import React from "react";

import { SKELETON } from "./classnames";

type HasClassNameElement = Pick<HTMLElement, "className">;

export interface SkeletonProps {
    /**
     * Element that need to displayed using the skeleton styles.
     */
    children: JSX.Element | JSX.Element[];
}

/**
 * `<Skeleton />` provides a loading state display of its children elements.
 * It does not provide its own content.
 */
export function Skeleton({ children }: SkeletonProps) {
    const alteredChildren = React.Children.map(children, (child) => {
        const originalChild = child as React.ReactElement;
        if (originalChild.props) {
            return React.cloneElement(originalChild, {
                className: originalChild.props.className ? originalChild.props.className + " " + SKELETON : SKELETON,
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
