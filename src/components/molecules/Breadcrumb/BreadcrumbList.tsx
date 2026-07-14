import React, { useCallback } from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";
import { TestableComponent } from "@/components/interfaces";

import BreadcrumbItem, { BreadcrumbItemProps } from "./BreadcrumbItem";

export interface BreadcrumbListProps extends TestableComponent {
    /**
     * Additional CSS class name.
     */
    className?: string;
    /**
        list of breadcrumb items to display
    */
    items: BreadcrumbItemProps[];
    /**
        Click handler used on all breadcrumb items using their `href` property.
        Is only used if the breadcrumb item have not defined an own `onClick` handler.
    */
    onItemClick?(itemUrl: string | undefined, event: object): boolean | void;
    /**
     * If set then a `div` element is used as wrapper.
     * It uses the attributes given via this property.
     */
    wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    /**
     * Do not re-render breadcrumbs in a shortened version if they overflow the available space.
     */
    ignoreOverflow?: boolean;
    /**
     * If set to `true` then breadcrumb items can shrink.
     * This way we cannot prevent overflowing breadcrumbs completely but this happens very late.
     * You should enable this when `ignoreOverflow` is `true`.
     */
    latenOverflow?: boolean;
}

/**
 * Navigation path to the currently show resource or view in the application.
 */
export const BreadcrumbList = ({
    className = "",
    items,
    onItemClick,
    ignoreOverflow = false,
    latenOverflow = false,
    wrapperProps,
    "data-test-id": dataTestId,
    "data-testid": dataTestid,
}: BreadcrumbListProps) => {
    // Only auto-wires `onItemClick` for items that don't already define their own `onClick`. Harmless
    // to also compute this for the current (last) item - `BreadcrumbItem` ignores `onClick` while `current`.
    const resolveOnClick = useCallback(
        (item: BreadcrumbItemProps) =>
            onItemClick && item.href && !item.onClick
                ? (event: React.MouseEvent<HTMLAnchorElement>) => {
                      onItemClick(item.href, event);
                  }
                : item.onClick,
        [onItemClick],
    );

    const breadcrumbs = (
        <nav aria-label="breadcrumb" data-slot="breadcrumb">
            <ol
                className={cn(
                    `${eccgui}-breadcrumb__list`,
                    "flex items-center gap-1.5",
                    latenOverflow && `${eccgui}-breadcrumb__list--latenoverflow`,
                    ignoreOverflow ? "flex-wrap" : "flex-nowrap overflow-hidden",
                    className,
                )}
                data-slot="breadcrumb-list"
            >
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    // The last item always represents the current view, regardless of what the item itself declares.
                    const resolvedItem = isLast ? { ...item, current: true } : item;
                    return (
                        <React.Fragment key={index}>
                            <li
                                className={cn(
                                    `${eccgui}-breadcrumb__list-item`,
                                    "inline-flex items-center gap-1.5",
                                    latenOverflow && "min-w-0 truncate",
                                )}
                                data-slot="breadcrumb-item"
                            >
                                <BreadcrumbItem {...resolvedItem} onClick={resolveOnClick(resolvedItem)} />
                            </li>
                            {!isLast && (
                                <li
                                    aria-hidden="true"
                                    role="presentation"
                                    className={`${eccgui}-breadcrumb__separator text-muted-foreground`}
                                    data-slot="breadcrumb-separator"
                                >
                                    <ChevronRight className="size-3.5" />
                                </li>
                            )}
                        </React.Fragment>
                    );
                })}
            </ol>
        </nav>
    );

    return wrapperProps || dataTestId || dataTestid ? (
        <div
            className={`${eccgui}-breadcrumb__list__wrapper`}
            {...(wrapperProps ?? {})}
            {...{ "data-test-id": dataTestId, "data-testid": dataTestid }}
        >
            {breadcrumbs}
        </div>
    ) : (
        <>{breadcrumbs}</>
    );
};

export default BreadcrumbList;
