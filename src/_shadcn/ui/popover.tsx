/**
 * Vendored shadcn/ui `popover` (style: new-york-v4).
 * Local adaptations: `cn` import path, per-primitive Radix packages,
 * `React.forwardRef` re-added (React 18 — registry code relies on React-19 ref-as-prop).
 */
import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "../../common/utils/cn";

function Popover({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>) {
    return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

const PopoverTrigger = React.forwardRef<
    React.ElementRef<typeof PopoverPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>((props, ref) => {
    return <PopoverPrimitive.Trigger ref={ref} data-slot="popover-trigger" {...props} />;
});
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverContent = React.forwardRef<
    React.ElementRef<typeof PopoverPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => {
    return (
        <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
                ref={ref}
                data-slot="popover-content"
                align={align}
                sideOffset={sideOffset}
                className={cn(
                    "z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
                    className
                )}
                {...props}
            />
        </PopoverPrimitive.Portal>
    );
});
PopoverContent.displayName = "PopoverContent";

const PopoverAnchor = React.forwardRef<
    React.ElementRef<typeof PopoverPrimitive.Anchor>,
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Anchor>
>((props, ref) => {
    return <PopoverPrimitive.Anchor ref={ref} data-slot="popover-anchor" {...props} />;
});
PopoverAnchor.displayName = "PopoverAnchor";

const PopoverHeader = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                data-slot="popover-header"
                className={cn("flex flex-col gap-1 text-sm", className)}
                {...props}
            />
        );
    }
);
PopoverHeader.displayName = "PopoverHeader";

const PopoverTitle = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"h2">>(
    ({ className, ...props }, ref) => {
        return <div ref={ref} data-slot="popover-title" className={cn("font-medium", className)} {...props} />;
    }
);
PopoverTitle.displayName = "PopoverTitle";

const PopoverDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<"p">>(
    ({ className, ...props }, ref) => {
        return (
            <p
                ref={ref}
                data-slot="popover-description"
                className={cn("text-muted-foreground", className)}
                {...props}
            />
        );
    }
);
PopoverDescription.displayName = "PopoverDescription";

export { Popover, PopoverAnchor, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger };
