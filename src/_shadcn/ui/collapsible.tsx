/**
 * Vendored shadcn/ui `collapsible` (style: radix-nova).
 * Local adaptations: per-primitive Radix packages,
 * `React.forwardRef` re-added (React 18 — registry code relies on React-19 ref-as-prop).
 */
import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

const Collapsible = React.forwardRef<
    React.ElementRef<typeof CollapsiblePrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>
>((props, ref) => {
    return <CollapsiblePrimitive.Root ref={ref} data-slot="collapsible" {...props} />;
});
Collapsible.displayName = "Collapsible";

const CollapsibleTrigger = React.forwardRef<
    React.ElementRef<typeof CollapsiblePrimitive.CollapsibleTrigger>,
    React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleTrigger>
>((props, ref) => {
    return <CollapsiblePrimitive.CollapsibleTrigger ref={ref} data-slot="collapsible-trigger" {...props} />;
});
CollapsibleTrigger.displayName = "CollapsibleTrigger";

const CollapsibleContent = React.forwardRef<
    React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
    React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>((props, ref) => {
    return <CollapsiblePrimitive.CollapsibleContent ref={ref} data-slot="collapsible-content" {...props} />;
});
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
