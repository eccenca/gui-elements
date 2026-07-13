/**
 * Vendored shadcn/ui `hover-card` (style: radix-nova).
 * Local adaptations: `cn` import path, per-primitive Radix packages,
 * `React.forwardRef` re-added (React 18 — registry code relies on React-19 ref-as-prop).
 */
import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import { cn } from "../../common/utils/cn";

function HoverCard({ ...props }: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
    return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
}

const HoverCardTrigger = React.forwardRef<
    React.ElementRef<typeof HoverCardPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Trigger>
>((props, ref) => {
    return <HoverCardPrimitive.Trigger ref={ref} data-slot="hover-card-trigger" {...props} />;
});
HoverCardTrigger.displayName = "HoverCardTrigger";

const HoverCardContent = React.forwardRef<
    React.ElementRef<typeof HoverCardPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => {
    return (
        <HoverCardPrimitive.Portal data-slot="hover-card-portal">
            <HoverCardPrimitive.Content
                ref={ref}
                data-slot="hover-card-content"
                align={align}
                sideOffset={sideOffset}
                className={cn(
                    "z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
                    className
                )}
                {...props}
            />
        </HoverCardPrimitive.Portal>
    );
});
HoverCardContent.displayName = "HoverCardContent";

export { HoverCard, HoverCardTrigger, HoverCardContent };
