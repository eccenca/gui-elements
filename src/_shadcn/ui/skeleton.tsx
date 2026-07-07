/**
 * Vendored shadcn/ui `skeleton` (style: new-york-v4).
 * Local adaptations: `cn` import path,
 * `React.forwardRef` re-added (React 18 — registry code relies on React-19 ref-as-prop).
 */
import * as React from "react";

import { cn } from "../../common/utils/cn";

const Skeleton = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
    ({ className, ...props }, ref) => {
        return <div ref={ref} data-slot="skeleton" className={cn("animate-pulse rounded-md bg-accent", className)} {...props} />;
    }
);
Skeleton.displayName = "Skeleton";

export { Skeleton };
