/**
 * Vendored shadcn/ui `button-group` (style: radix-nova).
 * Local adaptations: `cn` import path, `@radix-ui/react-slot` in place of the `Slot` export from
 * the `radix-ui` meta package, local `Separator` import,
 * `React.forwardRef` re-added (React 18 — registry code relies on React-19 ref-as-prop).
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../common/utils/cn";

import { Separator } from "./separator";

const buttonGroupVariants = cva(
    "group/button-group flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-lg [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
    {
        variants: {
            orientation: {
                horizontal:
                    "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg!",
                vertical:
                    "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg!",
            },
        },
        defaultVariants: {
            orientation: "horizontal",
        },
    }
);

const ButtonGroup = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<"div"> & VariantProps<typeof buttonGroupVariants>
>(({ className, orientation, ...props }, ref) => {
    return (
        <div
            ref={ref}
            role="group"
            data-slot="button-group"
            data-orientation={orientation}
            className={cn(buttonGroupVariants({ orientation }), className)}
            {...props}
        />
    );
});
ButtonGroup.displayName = "ButtonGroup";

const ButtonGroupText = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<"div"> & {
        asChild?: boolean;
    }
>(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";

    return (
        <Comp
            ref={ref}
            className={cn(
                "flex items-center gap-2 rounded-lg border bg-muted px-2.5 text-sm font-medium [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
                className
            )}
            {...props}
        />
    );
});
ButtonGroupText.displayName = "ButtonGroupText";

const ButtonGroupSeparator = React.forwardRef<
    React.ElementRef<typeof Separator>,
    React.ComponentPropsWithoutRef<typeof Separator>
>(({ className, orientation = "vertical", ...props }, ref) => {
    return (
        <Separator
            ref={ref}
            data-slot="button-group-separator"
            orientation={orientation}
            className={cn(
                "relative self-stretch bg-input data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto",
                className
            )}
            {...props}
        />
    );
});
ButtonGroupSeparator.displayName = "ButtonGroupSeparator";

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants };
