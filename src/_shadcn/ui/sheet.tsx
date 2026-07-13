/**
 * Vendored shadcn/ui `sheet` (style: radix-nova), built on the Dialog primitive.
 * Local adaptations: `cn` import path, `@radix-ui/react-dialog` in place of the `Dialog` export
 * from the `radix-ui` meta package, local `Button` import,
 * `React.forwardRef` re-added (React 18 — registry code relies on React-19 ref-as-prop).
 */
import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "../../common/utils/cn";

import { Button } from "./button";

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
    return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

const SheetTrigger = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Trigger>
>((props, ref) => {
    return <SheetPrimitive.Trigger ref={ref} data-slot="sheet-trigger" {...props} />;
});
SheetTrigger.displayName = "SheetTrigger";

const SheetClose = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Close>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Close>
>((props, ref) => {
    return <SheetPrimitive.Close ref={ref} data-slot="sheet-close" {...props} />;
});
SheetClose.displayName = "SheetClose";

function SheetPortal({ ...props }: React.ComponentProps<typeof SheetPrimitive.Portal>) {
    return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

const SheetOverlay = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => {
    return (
        <SheetPrimitive.Overlay
            ref={ref}
            data-slot="sheet-overlay"
            className={cn(
                "fixed inset-0 z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
                className
            )}
            {...props}
        />
    );
});
SheetOverlay.displayName = "SheetOverlay";

const SheetContent = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
        side?: "top" | "right" | "bottom" | "left";
        showCloseButton?: boolean;
    }
>(({ className, children, side = "right", showCloseButton = true, ...props }, ref) => {
    return (
        <SheetPortal>
            <SheetOverlay />
            <SheetPrimitive.Content
                ref={ref}
                data-slot="sheet-content"
                data-side={side}
                className={cn(
                    "fixed z-50 flex flex-col gap-4 bg-background bg-clip-padding text-sm shadow-lg transition duration-200 ease-in-out data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-[side=bottom]:data-open:slide-in-from-bottom-10 data-[side=left]:data-open:slide-in-from-left-10 data-[side=right]:data-open:slide-in-from-right-10 data-[side=top]:data-open:slide-in-from-top-10 data-closed:animate-out data-closed:fade-out-0 data-[side=bottom]:data-closed:slide-out-to-bottom-10 data-[side=left]:data-closed:slide-out-to-left-10 data-[side=right]:data-closed:slide-out-to-right-10 data-[side=top]:data-closed:slide-out-to-top-10",
                    className
                )}
                {...props}
            >
                {children}
                {showCloseButton && (
                    <SheetPrimitive.Close data-slot="sheet-close" asChild>
                        <Button variant="ghost" className="absolute top-3 right-3" size="icon-sm">
                            <XIcon />
                            <span className="sr-only">Close</span>
                        </Button>
                    </SheetPrimitive.Close>
                )}
            </SheetPrimitive.Content>
        </SheetPortal>
    );
});
SheetContent.displayName = "SheetContent";

const SheetHeader = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
    ({ className, ...props }, ref) => {
        return (
            <div ref={ref} data-slot="sheet-header" className={cn("flex flex-col gap-0.5 p-4", className)} {...props} />
        );
    }
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                data-slot="sheet-footer"
                className={cn("mt-auto flex flex-col gap-2 p-4", className)}
                {...props}
            />
        );
    }
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => {
    return (
        <SheetPrimitive.Title
            ref={ref}
            data-slot="sheet-title"
            className={cn("text-base font-medium text-foreground", className)}
            {...props}
        />
    );
});
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => {
    return (
        <SheetPrimitive.Description
            ref={ref}
            data-slot="sheet-description"
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    );
});
SheetDescription.displayName = "SheetDescription";

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription };
