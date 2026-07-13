/**
 * Vendored shadcn/ui `breadcrumb` (style: radix-nova).
 * Local adaptations: `cn` import path, `@radix-ui/react-slot` in place of the `Slot` export from
 * the `radix-ui` meta package,
 * `React.forwardRef` re-added (React 18 — registry code relies on React-19 ref-as-prop) on every
 * pure-markup/Slot element.
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";

import { cn } from "../../common/utils/cn";

const Breadcrumb = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<"nav">>(
    ({ className, ...props }, ref) => {
        return (
            <nav ref={ref} aria-label="breadcrumb" data-slot="breadcrumb" className={cn(className)} {...props} />
        );
    }
);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<"ol">>(
    ({ className, ...props }, ref) => {
        return (
            <ol
                ref={ref}
                data-slot="breadcrumb-list"
                className={cn(
                    "flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground",
                    className
                )}
                {...props}
            />
        );
    }
);
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
    ({ className, ...props }, ref) => {
        return (
            <li
                ref={ref}
                data-slot="breadcrumb-item"
                className={cn("inline-flex items-center gap-1", className)}
                {...props}
            />
        );
    }
);
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<
    HTMLAnchorElement,
    React.ComponentPropsWithoutRef<"a"> & {
        asChild?: boolean;
    }
>(({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";

    return (
        <Comp
            ref={ref}
            data-slot="breadcrumb-link"
            className={cn("transition-colors hover:text-foreground", className)}
            {...props}
        />
    );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
    ({ className, ...props }, ref) => {
        return (
            <span
                ref={ref}
                data-slot="breadcrumb-page"
                role="link"
                aria-disabled="true"
                aria-current="page"
                className={cn("font-normal text-foreground", className)}
                {...props}
            />
        );
    }
);
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
    ({ children, className, ...props }, ref) => {
        return (
            <li
                ref={ref}
                data-slot="breadcrumb-separator"
                role="presentation"
                aria-hidden="true"
                className={cn("[&>svg]:size-3.5", className)}
                {...props}
            >
                {children ?? <ChevronRightIcon />}
            </li>
        );
    }
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
    ({ className, ...props }, ref) => {
        return (
            <span
                ref={ref}
                data-slot="breadcrumb-ellipsis"
                role="presentation"
                aria-hidden="true"
                className={cn("flex size-5 items-center justify-center [&>svg]:size-4", className)}
                {...props}
            >
                <MoreHorizontalIcon />
                <span className="sr-only">More</span>
            </span>
        );
    }
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
};
