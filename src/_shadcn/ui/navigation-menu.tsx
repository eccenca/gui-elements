/**
 * Vendored shadcn/ui `navigation-menu` (style: radix-nova).
 * Local adaptations: `cn` import path, per-primitive Radix packages,
 * `React.forwardRef` re-added (React 18 — registry code relies on React-19 ref-as-prop).
 */
import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "../../common/utils/cn";

const NavigationMenu = React.forwardRef<
    React.ElementRef<typeof NavigationMenuPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> & {
        viewport?: boolean;
    }
>(({ className, children, viewport = true, ...props }, ref) => {
    return (
        <NavigationMenuPrimitive.Root
            ref={ref}
            data-slot="navigation-menu"
            data-viewport={viewport}
            className={cn(
                "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
                className
            )}
            {...props}
        >
            {children}
            {viewport && <NavigationMenuViewport />}
        </NavigationMenuPrimitive.Root>
    );
});
NavigationMenu.displayName = "NavigationMenu";

const NavigationMenuList = React.forwardRef<
    React.ElementRef<typeof NavigationMenuPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => {
    return (
        <NavigationMenuPrimitive.List
            ref={ref}
            data-slot="navigation-menu-list"
            className={cn("group flex flex-1 list-none items-center justify-center gap-0", className)}
            {...props}
        />
    );
});
NavigationMenuList.displayName = "NavigationMenuList";

const NavigationMenuItem = React.forwardRef<
    React.ElementRef<typeof NavigationMenuPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>
>(({ className, ...props }, ref) => {
    return (
        <NavigationMenuPrimitive.Item
            ref={ref}
            data-slot="navigation-menu-item"
            className={cn("relative", className)}
            {...props}
        />
    );
});
NavigationMenuItem.displayName = "NavigationMenuItem";

const navigationMenuTriggerStyle = cva(
    "group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center rounded-lg bg-background px-2.5 py-1.5 text-sm font-medium transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-popup-open:bg-muted/50 data-popup-open:hover:bg-muted data-open:bg-muted/50 data-open:hover:bg-muted data-open:focus:bg-muted"
);

const NavigationMenuTrigger = React.forwardRef<
    React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
    return (
        <NavigationMenuPrimitive.Trigger
            ref={ref}
            data-slot="navigation-menu-trigger"
            className={cn(navigationMenuTriggerStyle(), "group", className)}
            {...props}
        >
            {children}{" "}
            <ChevronDownIcon
                className="relative top-px ml-1 size-3 transition duration-300 group-data-popup-open/navigation-menu-trigger:rotate-180 group-data-open/navigation-menu-trigger:rotate-180"
                aria-hidden="true"
            />
        </NavigationMenuPrimitive.Trigger>
    );
});
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

const NavigationMenuContent = React.forwardRef<
    React.ElementRef<typeof NavigationMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => {
    return (
        <NavigationMenuPrimitive.Content
            ref={ref}
            data-slot="navigation-menu-content"
            className={cn(
                "top-0 left-0 w-full p-1 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-lg group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:ring-1 group-data-[viewport=false]/navigation-menu:ring-foreground/10 group-data-[viewport=false]/navigation-menu:duration-300 data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none md:absolute md:w-auto group-data-[viewport=false]/navigation-menu:data-open:animate-in group-data-[viewport=false]/navigation-menu:data-open:fade-in-0 group-data-[viewport=false]/navigation-menu:data-open:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-closed:animate-out group-data-[viewport=false]/navigation-menu:data-closed:fade-out-0 group-data-[viewport=false]/navigation-menu:data-closed:zoom-out-95",
                className
            )}
            {...props}
        />
    );
});
NavigationMenuContent.displayName = "NavigationMenuContent";

const NavigationMenuViewport = React.forwardRef<
    React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => {
    return (
        <div className={cn("absolute top-full left-0 isolate z-50 flex justify-center")}>
            <NavigationMenuPrimitive.Viewport
                ref={ref}
                data-slot="navigation-menu-viewport"
                className={cn(
                    "origin-top-center relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden rounded-lg bg-popover text-popover-foreground shadow ring-1 ring-foreground/10 duration-100 md:w-(--radix-navigation-menu-viewport-width) data-open:animate-in data-open:zoom-in-90 data-closed:animate-out data-closed:zoom-out-90",
                    className
                )}
                {...props}
            />
        </div>
    );
});
NavigationMenuViewport.displayName = "NavigationMenuViewport";

const NavigationMenuLink = React.forwardRef<
    React.ElementRef<typeof NavigationMenuPrimitive.Link>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>
>(({ className, ...props }, ref) => {
    return (
        <NavigationMenuPrimitive.Link
            ref={ref}
            data-slot="navigation-menu-link"
            className={cn(
                "flex items-center gap-2 rounded-lg p-2 text-sm transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1 in-data-[slot=navigation-menu-content]:rounded-md data-active:bg-muted/50 data-active:hover:bg-muted data-active:focus:bg-muted [&_svg:not([class*='size-'])]:size-4",
                className
            )}
            {...props}
        />
    );
});
NavigationMenuLink.displayName = "NavigationMenuLink";

const NavigationMenuIndicator = React.forwardRef<
    React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => {
    return (
        <NavigationMenuPrimitive.Indicator
            ref={ref}
            data-slot="navigation-menu-indicator"
            className={cn(
                "top-full z-1 flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in",
                className
            )}
            {...props}
        >
            <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
        </NavigationMenuPrimitive.Indicator>
    );
});
NavigationMenuIndicator.displayName = "NavigationMenuIndicator";

export {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuContent,
    NavigationMenuTrigger,
    NavigationMenuLink,
    NavigationMenuIndicator,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
};
