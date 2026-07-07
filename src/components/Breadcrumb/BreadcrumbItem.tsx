import React from "react";

import { cn } from "../../common/utils/cn";
import { openInNewTab } from "../../common/utils/openInNewTab";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { TestableComponent } from "../interfaces";

// FIXME: enforce href and remove onClick later
export interface BreadcrumbItemProps extends TestableComponent {
    /**
     * Additional CSS class name.
     */
    className?: string;
    /**
     * Breadcrumb label. Can be any single React renderable.
     */
    text?: React.ReactNode;
    /**
     * Link URL. Ignored while the item is `current` or `disabled`, i.e. it is only rendered
     * as an actual link if it is an actionable, non-current item.
     */
    href?: string;
    /**
     * Click event handler. Ignored while the item is `current` or `disabled`.
     */
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
    /**
     * Focus event handler.
     */
    onFocus?: (event: React.FocusEvent<HTMLAnchorElement>) => void;
    /**
     * Whether this item is non-interactive.
     */
    disabled?: boolean;
    /**
     * Whether this breadcrumb is the current one, i.e. represents the currently shown resource or view.
     * `BreadcrumbList` automatically sets this on the last item of its `items` array.
     */
    current?: boolean;
    /**
     * Additional content, rendered after `text`.
     */
    children?: React.ReactNode;
}

/**
 * Item of the breadcrumbs list.
 * It cannot be used directly but the properties can be used within the elements of the `BreadcrumbList.items` property.
 */
export const BreadcrumbItem = ({
    className = "",
    text,
    onClick,
    onFocus,
    href,
    current = false,
    disabled = false,
    children,
    "data-test-id": dataTestId,
    "data-testid": dataTestid,
}: BreadcrumbItemProps) => {
    // Current or disabled items never act as links, even if `href`/`onClick` are set.
    const canAct = !current && !disabled && (!!onClick || !!href);

    const itemClassName = cn(
        `${eccgui}-breadcrumb__item`,
        current
            ? `${eccgui}-breadcrumb__item--current font-normal text-foreground`
            : "text-muted-foreground",
        disabled && `${eccgui}-breadcrumb__item--disabled pointer-events-none opacity-50`,
        canAct &&
            "rounded-sm outline-none transition-colors hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className,
    );

    if (!canAct) {
        return (
            <span
                data-slot={current ? "breadcrumb-page" : "breadcrumb-item"}
                data-test-id={dataTestId}
                data-testid={dataTestid}
                className={itemClassName}
                role={current ? "link" : undefined}
                aria-current={current ? "page" : undefined}
                aria-disabled={current || disabled ? true : undefined}
            >
                {text}
                {children}
            </span>
        );
    }

    return (
        <a
            data-slot="breadcrumb-link"
            data-test-id={dataTestId}
            data-testid={dataTestid}
            className={itemClassName}
            href={href}
            onClick={(event) => openInNewTab(event, onClick, href)}
            onFocus={onFocus}
            tabIndex={0}
        >
            {text}
            {children}
        </a>
    );
};

export default BreadcrumbItem;
