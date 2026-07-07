import React from "react";

import { cn } from "../../common/utils/cn";
import { openInNewTab } from "../../common/utils/openInNewTab";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { TestableComponent } from "../interfaces";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, TestableComponent {
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Render the link as disabled, i.e. inert and without a target.
     */
    disabled?: boolean;
    /**
     * Style the link for usage inside running text (permanently underlined).
     * Without it the underline only appears on hover.
     */
    inline?: boolean;
    /**
     * Apply a distinct color when the link target was already visited.
     */
    visited?: boolean;
    /**
     * Typographic size of the link text. Without it the font size is inherited from the context.
     */
    size?: "sm" | "md" | "lg";
    /**
     * Optional element rendered after the link text, e.g. an icon.
     */
    renderIcon?: React.ReactNode;
}

/**
 * A textual hyperlink. Rendered as a plain `<a>` element styled via Tailwind utilities
 * (shadcn link convention). Holding CMD/CTRL while clicking opens `href` in a new tab.
 */
export const Link = ({
    className = "",
    children,
    href,
    onClick,
    disabled = false,
    inline = false,
    visited = false,
    size,
    renderIcon,
    tabIndex,
    "data-test-id": dataTestId,
    "data-testid": dataTestid,
    ...otherProps
}: LinkProps) => {
    const classes = cn(
        `${eccgui}-link`,
        "rounded-xs text-primary underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring",
        inline ? "underline" : "hover:underline",
        visited && "[&:visited]:text-primary/70",
        size === "sm" && `${eccgui}-link--sm text-xs`,
        size === "md" && `${eccgui}-link--md text-sm`,
        size === "lg" && `${eccgui}-link--lg text-base`,
        disabled && `${eccgui}-link--disabled pointer-events-none cursor-not-allowed text-muted-foreground no-underline`,
        className
    );

    return (
        <a
            className={classes}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : tabIndex}
            data-test-id={dataTestId}
            data-testid={dataTestid}
            {...otherProps}
            href={disabled ? undefined : (href as string | undefined)}
            onClick={
                disabled ? undefined : (e: React.MouseEvent<HTMLAnchorElement>) => openInNewTab(e, onClick, href)
            }
        >
            {children}
            {renderIcon}
        </a>
    );
};

export default Link;
