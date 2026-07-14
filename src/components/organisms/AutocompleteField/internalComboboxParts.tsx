import React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { useOverlayParent } from "@/common/overlay/OverlayParentContext";
import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

/**
 * INTERNAL shared building blocks for the combobox family (`Select`, `SuggestField`,
 * `MultiSuggestField`): local replacements for the `@blueprintjs/select` render prop types plus a
 * Radix-popover based dropdown shell. This module is intentionally NOT re-exported from any barrel
 * file — only the combobox components themselves are public API.
 */

// ---------------------------------------------------------------------------------------------
// Blueprint-shaped types (structural replacements for the former `@blueprintjs/select` imports).
// Property names and shapes are kept identical because app code destructures them.
// ---------------------------------------------------------------------------------------------

/** Modifiers passed to item renderers, mirroring Blueprint's `ItemModifiers`. */
export interface ComboboxItemModifiers {
    /** Whether the item is the keyboard-highlighted (active) row. */
    active: boolean;
    /** Whether the item is non-interactive. */
    disabled: boolean;
    /** Whether the item matches the current query predicate. */
    matchesPredicate: boolean;
}

/** Props object passed to item renderers, mirroring Blueprint's `ItemRendererProps`. */
export interface ComboboxItemRendererProps {
    /** Click handler that must be attached to the rendered element for mouse selection. */
    handleClick: React.MouseEventHandler<HTMLElement>;
    /** Focus handler (kept for shape compatibility). */
    handleFocus?: () => void;
    /** Index of the item in the filtered list. */
    index?: number;
    /** Modifiers, e.g. `active` for the keyboard-highlighted row. */
    modifiers: ComboboxItemModifiers;
    /** The current search query. */
    query: string;
}

/** Item renderer signature, mirroring Blueprint's `ItemRenderer<T>`. */
export type ComboboxItemRenderer<T> = (item: T, itemProps: ComboboxItemRendererProps) => React.JSX.Element | null;

/** "Create new item from query" renderer signature, mirroring Blueprint's `CreateNewItemRenderer`. */
export type ComboboxCreateNewItemRenderer = (
    query: string,
    active: boolean,
    handleClick: React.MouseEventHandler<HTMLElement>,
) => React.JSX.Element | undefined;

/** Equality prop, mirroring Blueprint's `ItemsEqualProp<T>`: comparator function or property name. */
export type ComboboxItemsEqualProp<T> = ((itemA: T, itemB: T) => boolean) | keyof T;

/** Executes an `itemsEqual` prop like Blueprint's `executeItemsEqual` (defaults to strict equality). */
export const executeItemsEqual = <T,>(
    itemsEqual: ComboboxItemsEqualProp<T> | undefined,
    itemA: T | undefined | null,
    itemB: T | undefined | null,
): boolean => {
    if (itemA == null || itemB == null) {
        return itemA === itemB;
    }
    if (typeof itemsEqual === "function") {
        return itemsEqual(itemA, itemB);
    }
    if (itemsEqual != null) {
        return itemA[itemsEqual] === itemB[itemsEqual];
    }
    return itemA === itemB;
};

// ---------------------------------------------------------------------------------------------
// `contextOverlayProps` mapping
// ---------------------------------------------------------------------------------------------

/**
 * Runtime-honored subset of the (frozen) `ContextOverlayProps` surface. The public props of the
 * combobox components keep referencing `ContextOverlayProps`; internally we only read these keys,
 * which decouples the components from the concurrent `ContextOverlay` migration.
 */
export interface OverlayPropsSubset {
    placement?: string;
    matchTargetWidth?: boolean;
    portalContainer?: HTMLElement;
    usePortal?: boolean;
    popoverClassName?: string;
    hasBackdrop?: boolean;
    isOpen?: boolean;
    onOpening?: (node?: HTMLElement) => void;
    onOpened?: (node?: HTMLElement) => void;
    onClosing?: (node?: HTMLElement) => void;
    onClosed?: (node?: HTMLElement) => void;
}

/** Reads the runtime-honored keys from an (unknown shaped) `contextOverlayProps` object. */
export const readOverlayProps = (value: unknown): OverlayPropsSubset => (value ?? {}) as OverlayPropsSubset;

/** Maps a Blueprint placement string (e.g. "bottom-start") to Radix `side`/`align` values. */
export const placementToRadix = (
    placement: string | undefined,
): { side: "top" | "right" | "bottom" | "left"; align: "start" | "center" | "end" } => {
    const [rawSide, rawAlign] = (placement ?? "bottom-start").split("-");
    const side = (["top", "right", "bottom", "left"].includes(rawSide) ? rawSide : "bottom") as
        | "top"
        | "right"
        | "bottom"
        | "left";
    const align = (rawAlign === "start" || rawAlign === "end" ? rawAlign : rawAlign === undefined ? "start" : "center") as
        | "start"
        | "center"
        | "end";
    return { side, align };
};

// ---------------------------------------------------------------------------------------------
// Dropdown shell
// ---------------------------------------------------------------------------------------------

export interface ComboboxDropdownProps {
    /** Whether the dropdown is displayed. The open state is fully owned by the calling component. */
    open: boolean;
    /**
     * Close request from the popover layer itself (outside pointer/focus interaction, Escape
     * pressed inside the content, backdrop click).
     */
    onCloseRequest: (reason: "outside" | "escape" | "backdrop") => void;
    /**
     * Returns `true` when the given event target belongs to the popover target/anchor. Such
     * interactions must not dismiss the dropdown (the classic input-in-anchor "relatedTarget
     * dance").
     */
    isAnchorInteraction?: (target: EventTarget | null) => boolean;
    /** The user provided `contextOverlayProps` (already reduced to the honored subset). */
    overlayProps?: OverlayPropsSubset;
    /** Default for `matchTargetWidth` when not set via `overlayProps` (usually the `fill` prop). */
    defaultMatchTargetWidth?: boolean;
    /** Default popover class name; can be replaced via `overlayProps.popoverClassName`. */
    defaultPopoverClassName?: string;
    /** Additional class names for the content element (always applied). */
    contentClassName?: string;
    /** Additional inline styles for the content element (e.g. CSS custom properties). */
    contentStyle?: React.CSSProperties;
    /** Additional (data-) attributes for the content element. */
    contentAttributes?: Record<string, unknown>;
    children: React.ReactNode;
}

/**
 * The popover part of the comboboxes: a non-modal Radix popover content, portaled into
 * `portalContainer` ?? `useOverlayParent()` ?? `document.body`, stacked via
 * `--eccgui-zindex-overlays`, optionally matching the target width and optionally backed by a
 * click-capturing backdrop (Blueprint `hasBackdrop` parity, needed e.g. on react-flow canvases).
 *
 * Must be rendered inside a `PopoverPrimitive.Root` together with a `PopoverPrimitive.Anchor`.
 */
export const ComboboxDropdown = ({
    open,
    onCloseRequest,
    isAnchorInteraction,
    overlayProps = {},
    defaultMatchTargetWidth = false,
    defaultPopoverClassName,
    contentClassName,
    contentStyle,
    contentAttributes,
    children,
}: ComboboxDropdownProps) => {
    const overlayParent = useOverlayParent();
    const contentRef = React.useRef<HTMLDivElement>(null);
    const { side, align } = placementToRadix(overlayProps.placement);
    const matchTargetWidth = overlayProps.matchTargetWidth ?? defaultMatchTargetWidth;
    const usePortal = overlayProps.usePortal ?? true;
    const portalContainer = overlayProps.portalContainer ?? overlayParent;

    // Blueprint parity: open/close lifecycle callbacks.
    const wasOpen = React.useRef(false);
    const callbacksRef = React.useRef(overlayProps);
    callbacksRef.current = overlayProps;
    React.useEffect(() => {
        const node = contentRef.current ?? undefined;
        const { onOpening, onOpened, onClosing, onClosed } = callbacksRef.current;
        if (open && !wasOpen.current) {
            onOpening?.(node);
            onOpened?.(node);
        } else if (!open && wasOpen.current) {
            onClosing?.(node);
            onClosed?.(node);
        }
        wasOpen.current = open;
    }, [open]);

    const content = (
        <PopoverPrimitive.Content
            ref={contentRef}
            side={side}
            align={align}
            sideOffset={2}
            onOpenAutoFocus={(event) => event.preventDefault()}
            onCloseAutoFocus={(event) => event.preventDefault()}
            onEscapeKeyDown={() => onCloseRequest("escape")}
            onInteractOutside={(event) => {
                if (isAnchorInteraction?.(event.target)) {
                    event.preventDefault();
                    return;
                }
                onCloseRequest("outside");
            }}
            // Keep the focus inside the (target) input while interacting with the dropdown
            // content — except for editable elements inside the content (e.g. the filter input
            // of `Select`), which need default mouse behavior to receive focus/caret placement.
            onMouseDown={(event) => {
                const target = event.target as HTMLElement;
                const isEditable =
                    target instanceof HTMLInputElement ||
                    target instanceof HTMLTextAreaElement ||
                    target.isContentEditable;
                if (!isEditable) {
                    event.preventDefault();
                }
            }}
            className={cn(
                overlayProps.popoverClassName ?? defaultPopoverClassName,
                "rounded-md border bg-popover text-popover-foreground shadow-md outline-hidden",
                contentClassName,
            )}
            style={{
                zIndex: "var(--eccgui-zindex-overlays)",
                width: matchTargetWidth ? "var(--radix-popover-trigger-width)" : undefined,
                minWidth: matchTargetWidth ? "var(--radix-popover-trigger-width)" : undefined,
                ...contentStyle,
            }}
            {...(contentAttributes ?? {})}
        >
            {children}
        </PopoverPrimitive.Content>
    );

    const backdrop =
        overlayProps.hasBackdrop && open ? (
            <div
                className={`${eccgui}-combobox__backdrop fixed inset-0`}
                style={{ zIndex: "var(--eccgui-zindex-overlays)" }}
                onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onCloseRequest("backdrop");
                }}
            />
        ) : null;

    if (!usePortal) {
        return (
            <>
                {backdrop}
                {content}
            </>
        );
    }

    return (
        <PopoverPrimitive.Portal container={portalContainer}>
            <>
                {backdrop}
                {content}
            </>
        </PopoverPrimitive.Portal>
    );
};

// ---------------------------------------------------------------------------------------------
// Keyboard navigation over rendered rows
// ---------------------------------------------------------------------------------------------

export interface ComboboxNavRow {
    /** Stable key of the row ("create" for the create-new-item row, otherwise item derived). */
    key: string;
    disabled?: boolean;
}

/**
 * Roving "active row" state over the currently rendered listbox rows (Blueprint's `activeItem`).
 * The row list is recomputed every render by the calling component; if the active key disappears
 * from the row list the first enabled row becomes active again.
 */
export const useActiveRow = (rows: ComboboxNavRow[]) => {
    const [activeKey, setActiveKey] = React.useState<string | undefined>(undefined);

    const firstEnabled = rows.find((row) => !row.disabled)?.key;
    const effectiveActiveKey =
        activeKey !== undefined && rows.some((row) => row.key === activeKey && !row.disabled)
            ? activeKey
            : firstEnabled;

    /** Moves the active row up/down with wrap-around, skipping disabled rows. */
    const moveActive = (direction: 1 | -1) => {
        const enabled = rows.filter((row) => !row.disabled);
        if (enabled.length === 0) {
            return;
        }
        const currentIndex = enabled.findIndex((row) => row.key === effectiveActiveKey);
        const nextIndex = currentIndex < 0 ? 0 : (currentIndex + direction + enabled.length) % enabled.length;
        setActiveKey(enabled[nextIndex].key);
    };

    const resetActive = () => setActiveKey(undefined);

    return { activeKey: effectiveActiveKey, setActiveKey, moveActive, resetActive };
};

/** Scrolls the keyboard-highlighted row into view (rows highlighted via `MenuItem` `active`). */
export const scrollActiveRowIntoView = (listElement: HTMLElement | null) => {
    const activeElement = listElement?.querySelector(`.${eccgui}-menu__item--active`);
    activeElement?.scrollIntoView?.({ block: "nearest" });
};
