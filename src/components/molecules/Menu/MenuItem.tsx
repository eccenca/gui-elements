import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronRight } from "lucide-react";

import { intentClassName, IntentTypes } from "@/common/Intent";
import { cn } from "@/common/utils/cn";
import { openInNewTab } from "@/common/utils/openInNewTab";
import { ValidIconName } from "@/components/atoms/Icon/canonicalIconNames";
import Icon from "@/components/atoms/Icon/Icon";
import { TestIconProps } from "@/components/atoms/Icon/TestIcon";
import Tooltip from "@/components/atoms/Tooltip/Tooltip";
import { TestableComponent } from "@/components/interfaces";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

import Menu from "./Menu";
import { menuDropdownContentClassName, useMenuMode } from "./MenuContext";

export interface MenuItemProps extends Omit<React.HTMLAttributes<HTMLElement>, "onClick" | "title">, TestableComponent {
    /**
     * The (primary) label of the menu item.
     */
    text?: React.ReactNode;
    /**
     * If set the icon is displayed on the left side of the menu item.
     */
    icon?: ValidIconName | string[] | React.ReactElement<TestIconProps>;
    /**
     * Submenu. When set the item becomes a submenu toggler; the children are displayed in a nested
     * menu (as a Radix submenu when used inside a dropdown/`ContextMenu`).
     */
    children?: React.ReactNode;
    /**
     * Tooltip, but only added to the label, not to the full menu item.
     */
    tooltip?: string | React.JSX.Element;
    /**
     * Click/select handler. Fires on pointer click as well as on keyboard activation
     * (Enter/Space) when the item is used inside a dropdown menu.
     */
    onClick?: React.MouseEventHandler<HTMLElement>;
    /**
     * Turn the menu item into a link that navigates to this URL.
     */
    href?: string;
    /**
     * Link target, only relevant together with `href`.
     */
    target?: React.HTMLAttributeAnchorTarget;
    /**
     * Link relationship, only relevant together with `href`.
     */
    rel?: string;
    /**
     * Item cannot be interacted with.
     */
    disabled?: boolean;
    /**
     * Highlight the item as the currently active/focused entry. Used by `Select`/`Suggest` item
     * renderers where the parent owns keyboard navigation.
     */
    active?: boolean;
    /**
     * Marks the item as selected (e.g. a chosen option).
     */
    selected?: boolean;
    /**
     * Intent state visualized by color.
     */
    intent?: IntentTypes;
    /**
     * Allow the item label to wrap over multiple lines.
     */
    multiline?: boolean;
    /**
     * Secondary label, displayed right-aligned.
     */
    label?: React.ReactNode;
    /**
     * Secondary label element, displayed right-aligned.
     */
    labelElement?: React.ReactNode;
    /**
     * Accessible role structure of the item (kept for API compatibility).
     */
    roleStructure?: "menuitem" | "listoption" | "listitem" | "none";
    /**
     * Whether selecting this item should close the surrounding dropdown menu. Defaults to `true`.
     * Only relevant when used inside a dropdown/`ContextMenu`.
     */
    shouldDismissPopover?: boolean;
    /**
     * Value of the `title` HTML attribute of the item.
     */
    htmlTitle?: string;
    /**
     * Value of the `title` HTML attribute of the item.
     */
    title?: string;
}

const itemLayoutClasses =
    "relative flex w-full cursor-pointer select-none items-center gap-x-1.5 rounded-md px-1.5 py-1 text-sm " +
    "text-foreground no-underline outline-hidden hover:no-underline " +
    "[&_svg]:pointer-events-none [&_svg]:shrink-0";
const itemHighlightClasses =
    "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground " +
    "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground";
const itemActiveClasses = "bg-accent text-accent-foreground";
const itemDisabledClasses = "cursor-default opacity-50 pointer-events-none data-[disabled]:pointer-events-none";
// Former `.eccgui-menu__item .eccgui-button--icon { &, &:hover, &:focus, &:active { color: inherit } }`
// (icon.scss): an icon-only `Button`/`IconButton` nested in a menu item (e.g. a trailing action)
// should pick up the row's own (hover/focus/active) text color instead of the button's own.
const itemIconButtonInheritClasses =
    "[&_.eccgui-button--icon]:text-inherit [&_.eccgui-button--icon:hover]:text-inherit " +
    "[&_.eccgui-button--icon:focus]:text-inherit [&_.eccgui-button--icon:active]:text-inherit";

const roleFor = (roleStructure: MenuItemProps["roleStructure"]): React.AriaRole | undefined => {
    switch (roleStructure) {
        case "none":
            return undefined;
        case "listoption":
            return "option";
        case "listitem":
            return "listitem";
        default:
            return "menuitem";
    }
};

/**
 * Single item, used as child inside `Menu` or `ContextMenu`.
 *
 * Renders in one of two modes depending on context (see {@link useMenuMode}):
 * - inside a dropdown/`ContextMenu` it renders as a Radix dropdown-menu item (and, when it has
 *   children, a Radix submenu) so it participates in keyboard navigation/typeahead;
 * - standalone (default) it renders a plain, styled `<li>` row — the shape relied upon by
 *   `Select`/`Suggest`/`AutoSuggestion` item renderers.
 */
export const MenuItem = ({
    children,
    className = "",
    icon,
    onClick,
    href,
    target,
    rel,
    text,
    tooltip,
    disabled = false,
    active = false,
    selected = false,
    intent,
    multiline = false,
    label,
    labelElement,
    roleStructure,
    shouldDismissPopover = true,
    htmlTitle,
    title,
    ...restProps
}: MenuItemProps) => {
    const mode = useMenuMode();

    const iconElement = icon ? (
        <span className={`${eccgui}-menu__item-icon flex items-center`} aria-hidden={true}>
            {typeof icon === "string" || Array.isArray(icon) ? <Icon name={icon} small /> : icon}
        </span>
    ) : null;

    const labelContent = labelElement ?? label;
    const labelSlot =
        labelContent != null ? (
            <span className={`${eccgui}-menu__item-label ml-auto pl-4 text-muted-foreground`}>{labelContent}</span>
        ) : null;

    const textSlot = (
        <div className={cn(`${eccgui}-menu__item-text min-w-0 grow`, multiline ? "whitespace-normal" : "truncate")}>
            {tooltip ? (
                <Tooltip content={tooltip} size="small">
                    <span>{text}</span>
                </Tooltip>
            ) : (
                text
            )}
        </div>
    );

    const content = (
        <>
            {iconElement}
            {textSlot}
            {labelSlot}
        </>
    );

    const rowClassName = cn(
        `${eccgui}-menu__item`,
        itemLayoutClasses,
        !disabled && itemHighlightClasses,
        active && `${eccgui}-menu__item--active ${itemActiveClasses}`,
        disabled && itemDisabledClasses,
        intent && intentClassName(intent),
        itemIconButtonInheritClasses,
        className,
    );

    const resolvedTitle = htmlTitle ?? title;
    const handleClick = disabled
        ? undefined
        : (e: React.MouseEvent<HTMLElement>) => openInNewTab(e as React.MouseEvent<HTMLAnchorElement>, onClick, href);

    // --- Dropdown mode -----------------------------------------------------------------------
    if (mode === "dropdown") {
        // Prevent the surrounding dropdown from closing when `shouldDismissPopover === false`.
        const handleSelect = (event: Event) => {
            if (shouldDismissPopover === false) {
                event.preventDefault();
            }
        };

        if (children) {
            return (
                <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger
                        {...restProps}
                        className={cn(
                            rowClassName,
                            "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
                        )}
                        disabled={disabled}
                        title={resolvedTitle}
                    >
                        {content}
                        <ChevronRight className="ml-auto size-4" />
                    </DropdownMenu.SubTrigger>
                    <DropdownMenu.SubContent
                        className={menuDropdownContentClassName}
                        style={{ zIndex: "var(--eccgui-zindex-overlays)" }}
                    >
                        <Menu>{children}</Menu>
                    </DropdownMenu.SubContent>
                </DropdownMenu.Sub>
            );
        }

        if (href) {
            return (
                <DropdownMenu.Item asChild disabled={disabled} onSelect={handleSelect}>
                    <a
                        {...restProps}
                        href={href}
                        target={target}
                        rel={rel}
                        className={rowClassName}
                        onClick={handleClick}
                        title={resolvedTitle}
                        aria-selected={active || selected || undefined}
                    >
                        {content}
                    </a>
                </DropdownMenu.Item>
            );
        }

        return (
            <DropdownMenu.Item
                {...restProps}
                className={rowClassName}
                disabled={disabled}
                onClick={handleClick}
                onSelect={handleSelect}
                title={resolvedTitle}
                aria-selected={active || selected || undefined}
            >
                {content}
            </DropdownMenu.Item>
        );
    }

    // --- Static mode -------------------------------------------------------------------------
    // Plain `<li>` row. The DOM shape (`<li class="eccgui-menu__item">`, hover handlers on the `<li>`)
    // matches what Select/Suggest/AutoSuggestion item renderers rely on.
    const rowBody = href ? (
        <a href={href} target={target} rel={rel} className="flex min-w-0 grow items-center gap-x-2 no-underline">
            {content}
        </a>
    ) : (
        content
    );

    return (
        <li
            {...restProps}
            role={roleFor(roleStructure)}
            aria-disabled={disabled || undefined}
            aria-selected={active || selected || undefined}
            data-active={active || undefined}
            title={resolvedTitle}
            className={cn(rowClassName, children && "flex-wrap")}
            onClick={handleClick}
        >
            {rowBody}
            {children ? <Menu className={`${eccgui}-menu__submenu basis-full pl-6`}>{children}</Menu> : null}
        </li>
    );
};

export default MenuItem;
