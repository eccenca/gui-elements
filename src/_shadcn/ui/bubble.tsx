/**
 * Vendored shadcn/ui `bubble` (June 2026 chat components, style: new-york-v4).
 * Local adaptations: `cn` import path, per-primitive Radix packages
 * (`@radix-ui/react-slot` instead of the `radix-ui` umbrella), `React.forwardRef`
 * re-added (React 18 — registry code relies on React-19 ref-as-prop).
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../common/utils/cn";

const BubbleGroup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
    ({ className, ...props }, ref) => (
        <div ref={ref} data-slot="bubble-group" className={cn("flex min-w-0 flex-col gap-2", className)} {...props} />
    ),
);
BubbleGroup.displayName = "BubbleGroup";

const bubbleVariants = cva(
    "group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end data-[variant=ghost]:max-w-full",
    {
        variants: {
            variant: {
                default:
                    "*:data-[slot=bubble-content]:bg-primary *:data-[slot=bubble-content]:text-primary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-primary/80",
                secondary:
                    "*:data-[slot=bubble-content]:bg-secondary *:data-[slot=bubble-content]:text-secondary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]",
                muted: "*:data-[slot=bubble-content]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_5%)]",
                tinted: "*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.93_calc(c*0.4)_h)] *:data-[slot=bubble-content]:text-foreground dark:*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.3_calc(c*0.4)_h)] [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.88_calc(c*0.5)_h)] dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.35_calc(c*0.5)_h)]",
                outline:
                    "*:data-[slot=bubble-content]:border-border *:data-[slot=bubble-content]:bg-background [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-input/30",
                ghost: "border-none *:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted/50",
                destructive:
                    "*:data-[slot=bubble-content]:bg-destructive/10 *:data-[slot=bubble-content]:text-destructive dark:*:data-[slot=bubble-content]:bg-destructive/20 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/20 dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/30",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

export interface BubbleProps extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof bubbleVariants> {
    align?: "start" | "end";
}

const Bubble = React.forwardRef<HTMLDivElement, BubbleProps>(
    ({ variant = "default", align = "start", className, ...props }, ref) => (
        <div
            ref={ref}
            data-slot="bubble"
            data-variant={variant}
            data-align={align}
            className={cn(bubbleVariants({ variant }), className)}
            {...props}
        />
    ),
);
Bubble.displayName = "Bubble";

export interface BubbleContentProps extends React.ComponentPropsWithoutRef<"div"> {
    asChild?: boolean;
}

const BubbleContent = React.forwardRef<HTMLDivElement, BubbleContentProps>(
    ({ asChild = false, className, ...props }, ref) => {
        const Comp = asChild ? Slot : "div";

        return (
            <Comp
                ref={ref}
                data-slot="bubble-content"
                className={cn(
                    "w-fit max-w-full min-w-0 overflow-hidden rounded-xl border border-transparent px-3 py-2 text-sm leading-relaxed wrap-break-word group-data-[align=end]/bubble:self-end [button]:text-left [button,a]:transition-colors [button,a]:outline-none [button,a]:focus-visible:border-ring [button,a]:focus-visible:ring-3 [button,a]:focus-visible:ring-ring/50",
                    className,
                )}
                {...props}
            />
        );
    },
);
BubbleContent.displayName = "BubbleContent";

const bubbleReactionsVariants = cva(
    "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-sm ring-3 ring-card has-[button]:p-0",
    {
        variants: {
            side: {
                top: "top-0 -translate-y-3/4",
                bottom: "bottom-0 translate-y-3/4",
            },
            align: {
                start: "left-3",
                end: "right-3",
            },
        },
        defaultVariants: {
            side: "bottom",
            align: "end",
        },
    },
);

export interface BubbleReactionsProps extends React.ComponentPropsWithoutRef<"div"> {
    align?: "start" | "end";
    side?: "top" | "bottom";
}

const BubbleReactions = React.forwardRef<HTMLDivElement, BubbleReactionsProps>(
    ({ side = "bottom", align = "end", className, ...props }, ref) => (
        <div
            ref={ref}
            data-slot="bubble-reactions"
            data-align={align}
            data-side={side}
            className={cn(bubbleReactionsVariants({ side, align }), className)}
            {...props}
        />
    ),
);
BubbleReactions.displayName = "BubbleReactions";

export { BubbleGroup, Bubble, BubbleContent, BubbleReactions, bubbleVariants, bubbleReactionsVariants };
