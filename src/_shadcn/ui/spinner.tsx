/**
 * Vendored shadcn/ui `spinner` (style: radix-nova).
 * Local adaptations: `cn` import path, explicit `React` import (the source relied on the ambient
 * `React` UMD type-only global to type its props), `React.forwardRef` re-added (React 18 —
 * registry code relies on React-19 ref-as-prop) forwarding to the underlying `Loader2Icon` svg.
 */
import * as React from "react";
import { Loader2Icon } from "lucide-react";

import { cn } from "../../common/utils/cn";

const Spinner = React.forwardRef<SVGSVGElement, React.ComponentPropsWithoutRef<"svg">>(
    ({ className, ...props }, ref) => {
        return (
            <Loader2Icon
                ref={ref}
                data-slot="spinner"
                role="status"
                aria-label="Loading"
                className={cn("size-4 animate-spin", className)}
                {...props}
            />
        );
    },
);
Spinner.displayName = "Spinner";

export { Spinner };
