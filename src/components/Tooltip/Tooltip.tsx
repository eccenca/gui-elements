import React from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";

import { IntentTypes } from "../../common/Intent";
import { useOverlayParent } from "../../common/overlay/OverlayParentContext";
import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { Markdown, MarkdownProps } from "./../../cmem/markdown/Markdown";

export type TooltipSize = "small" | "medium" | "large";

/**
 * Placement of the tooltip relative to its target.
 * Keeps the historical Blueprint/popper.js placement strings for a frozen API; they are
 * mapped internally to Radix `side` + `align`. `auto*` values fall back to the default
 * side (top) with Radix' built-in collision-aware flipping.
 */
export type TooltipPlacement =
    | "auto"
    | "auto-start"
    | "auto-end"
    | "top"
    | "top-start"
    | "top-end"
    | "right"
    | "right-start"
    | "right-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end";

export interface TooltipProps {
    /**
     * The tooltip will be attached to this element when it is hovered.
     */
    children: React.ReactNode | React.ReactNode[];
    /**
     * The content displayed inside the tooltip overlay.
     * If it is only a string then it can optionally be rendered as Markdown, see `markdownEnabler`.
     * An empty (or missing) content disables the tooltip and only renders the target.
     */
    content?: React.ReactNode;
    /**
     * Additional class name set on the target wrapper element and, suffixed with `__content`,
     * on the tooltip overlay element.
     */
    className?: string;
    /**
     * The size specifies the dimension the tooltip overlay element can maximal grow.
     */
    size?: TooltipSize;
    /**
     * Add dotted underline as visual indication to the target that a tooltip is attached.
     * Should be used together with text-only elements.
     */
    addIndicator?: boolean;
    /**
     * A regular expression that when it matches against the tooltip text, enables the tooltip to be rendered as Markdown.
     * This only works if the tooltip content is a string.
     * Set to `false` to turn off Markdown rendering completely.
     */
    markdownEnabler?: false | string;
    /**
     * Set properties for the Markdown parser
     */
    markdownProps?: Omit<MarkdownProps, "children">;

    // -- placement / behaviour (mapped onto Radix) ----------------------------------------------
    /**
     * Placement of the tooltip relative to the target. Mapped onto Radix `side`/`align`.
     */
    placement?: TooltipPlacement;
    /**
     * Delay in milliseconds before the tooltip opens on hover.
     */
    hoverOpenDelay?: number;
    /**
     * Disables the tooltip completely; only the target is rendered.
     */
    disabled?: boolean;
    /**
     * Controlled open state.
     */
    isOpen?: boolean;
    /**
     * Initial (uncontrolled) open state.
     */
    defaultIsOpen?: boolean;
    /**
     * Visual intent. Currently only forwarded as a `data-tooltip-intent` attribute (no default styling).
     */
    intent?: IntentTypes;

    // -- target wrapper -------------------------------------------------------------------------
    /**
     * Tag name of the target wrapper element (defaults to `span`, or `div` when `fill` is set).
     */
    targetTagName?: keyof JSX.IntrinsicElements;
    /**
     * Additional properties for the target wrapper element.
     */
    targetProps?: React.HTMLProps<HTMLElement>;
    /**
     * Let the target wrapper fill the available width (renders it as a block-level `div`).
     */
    fill?: boolean;
    /**
     * Inline styles for the target wrapper element.
     */
    style?: React.CSSProperties;

    // -- lifecycle callbacks (Blueprint compatible) ---------------------------------------------
    /** Called when the tooltip starts to open. */
    onOpening?: (...args: any[]) => void;
    /** Called when the tooltip finished opening. */
    onOpened?: (...args: any[]) => void;
    /** Called when the tooltip finished closing. */
    onClose?: (...args: any[]) => void;
    /** Called when the tooltip starts to close. */
    onClosing?: (...args: any[]) => void;
    /** Called whenever the open state changes, with the next open state. */
    onInteraction?: (nextOpenState: boolean, e?: React.SyntheticEvent<HTMLElement>) => void;

    // -- portal ---------------------------------------------------------------------------------
    /**
     * Explicit portal container for the tooltip overlay. When omitted the nearest
     * {@link useOverlayParent} container (or `document.body`) is used.
     */
    portalContainer?: HTMLElement;

    // -- deprecated / no-op props kept for a frozen API -----------------------------------------
    /**
     * @deprecated Radix renders the tooltip content lazily by design; the placeholder swap
     * machinery has been removed. This prop is accepted but has no effect.
     */
    usePlaceholder?: boolean;
    /**
     * @deprecated No effect; the placeholder swap machinery has been removed.
     */
    swapPlaceholderDelay?: number;
    /**
     * @deprecated Radix positions collision-aware against the viewport by default; no effect.
     */
    rootBoundary?: unknown;
    /**
     * @deprecated Blueprint popper modifiers. Only a set `offset` modifier is translated to
     * Radix `sideOffset`/`alignOffset`; everything else is ignored.
     */
    modifiers?: any;
    /**
     * @deprecated Radix tooltips have no separate close delay; no effect.
     */
    hoverCloseDelay?: number;
    /**
     * @deprecated Radix tooltips do not trap focus; no effect.
     */
    autoFocus?: boolean;
    /**
     * @deprecated Radix tooltips do not trap focus; no effect.
     */
    enforceFocus?: boolean;
    /**
     * @deprecated Radix opens on focus of a focusable trigger; no effect.
     */
    openOnTargetFocus?: boolean;
    /**
     * @deprecated Radix always renders the overlay through a portal; no effect.
     */
    usePortal?: boolean;
    /**
     * @deprecated No effect under the Radix tooltip.
     */
    minimal?: boolean;
    /**
     * @deprecated Custom target renderers are no longer supported; no effect.
     */
    renderTarget?: (...args: any[]) => React.ReactNode;
    /**
     * @deprecated Only hover/focus interaction is supported; no effect.
     */
    interactionKind?: unknown;
}

type RadixSide = "top" | "right" | "bottom" | "left";
type RadixAlign = "start" | "center" | "end";

/** Map a Blueprint/popper placement string onto Radix `side` + `align`. */
const parsePlacement = (placement?: TooltipPlacement): { side?: RadixSide; align?: RadixAlign } => {
    if (!placement || placement.startsWith("auto")) {
        // Radix defaults to `side="top"` and flips collision-aware, matching Blueprint's "auto".
        return {};
    }
    const [sideRaw, alignRaw] = placement.split("-");
    const side = (["top", "right", "bottom", "left"] as string[]).includes(sideRaw)
        ? (sideRaw as RadixSide)
        : undefined;
    const align: RadixAlign = alignRaw === "start" ? "start" : alignRaw === "end" ? "end" : "center";
    return { side, align };
};

/** Translate a Blueprint `offset` popper modifier (`[skidding, distance]`) to Radix offsets. */
const parseOffset = (modifiers?: any): { sideOffset?: number; alignOffset?: number } => {
    const offset = modifiers?.offset?.options?.offset;
    if (Array.isArray(offset)) {
        return { alignOffset: offset[0], sideOffset: offset[1] };
    }
    return {};
};

/**
 * shadcn/ui tooltip content recipe (style: new-york-v4), without the fixed `z-50` (the z-index is
 * driven by the shared `--eccgui-zindex-overlays` custom property so tooltips stack above modals)
 * and with explicit wrapping so long text breaks like the previous Blueprint tooltip.
 */
const tooltipContentRecipe =
    "w-fit origin-(--radix-tooltip-content-transform-origin) animate-in rounded-md bg-foreground px-3 py-1.5 " +
    "text-xs text-balance break-words whitespace-normal text-background fade-in-0 zoom-in-95 " +
    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 " +
    "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 " +
    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 " +
    // former `.eccgui-tooltip__content a / pre` rules (tooltip.scss): links inside (markdown)
    // content stay plain, code blocks get a faint currentColor-tinted background.
    "[&_a]:text-inherit [&_a]:no-underline [&_pre]:bg-[color-mix(in_oklab,currentcolor_20%,transparent)]";

/**
 * Max-width per `size` (former `.eccgui-tooltip--{small,medium,large}` rules in `tooltip.scss`,
 * historically `@extend`ed from there by `DecoupledOverlay`). Fixed px caps (formerly `em`-
 * multiples of a shared `20em` width): the old value lived on the same element as the content
 * font-size (`text-xs` above), so it silently rescaled whenever that font-size's root-relative
 * basis changed (as it did when the rem root moved from 14px to 16px), even though the intended
 * tooltip width never should - these reproduce the former 10em/20em/40em widths at the (now
 * pinned) 12px caption size exactly, just without the `em` indirection.
 *
 * Re-exported so `DecoupledOverlay` (which shares the same `size` axis and used to `@extend`
 * these classes) applies the identical values.
 */
export const tooltipSizeMaxWidthClass: Record<TooltipSize, string> = {
    small: "max-w-[120px]",
    medium: "max-w-[240px]",
    large: "max-w-[480px]",
};

export const Tooltip = ({
    children,
    content,
    className = "",
    size = "medium",
    addIndicator = false,
    markdownEnabler = "\n\n",
    markdownProps,
    placement,
    hoverOpenDelay = 450,
    disabled = false,
    isOpen,
    defaultIsOpen,
    intent,
    targetTagName,
    targetProps,
    fill = false,
    style,
    onOpening,
    onOpened,
    onClose,
    onClosing,
    onInteraction,
    portalContainer,
    // deprecated / no-op props — destructured so they never leak onto the DOM
    usePlaceholder: _usePlaceholder,
    swapPlaceholderDelay: _swapPlaceholderDelay,
    rootBoundary: _rootBoundary,
    modifiers,
    hoverCloseDelay: _hoverCloseDelay,
    autoFocus: _autoFocus,
    enforceFocus: _enforceFocus,
    openOnTargetFocus: _openOnTargetFocus,
    usePortal: _usePortal,
    minimal: _minimal,
    renderTarget: _renderTarget,
    interactionKind: _interactionKind,
    ...otherProps
}: TooltipProps) => {
    const overlayParent = useOverlayParent();
    const container = portalContainer ?? overlayParent;

    const targetClassName = cn(
        `${eccgui}-tooltip__wrapper`,
        // former `.eccgui-tooltip__wrapper { cursor: inherit }` (tooltip.scss) - the historical
        // Blueprint-indicator exclusion is gone with Blueprint itself; `addIndicator` below still
        // wins over this default via cascade order (`cursor-help` is listed after it).
        "cursor-[inherit]",
        className || undefined,
        addIndicator &&
            `${eccgui}-tooltip__wrapper--indicator underline decoration-dotted underline-offset-2 cursor-help`,
    );

    const TargetTag = (targetTagName ?? (fill ? "div" : "span")) as React.ElementType;

    // `createElement` (instead of JSX) avoids TS checking the props against every possible
    // intrinsic element of the `ElementType` union; the result is still a single element for
    // Radix `Trigger asChild`.
    const target = React.createElement(
        TargetTag,
        {
            ...otherProps,
            ...targetProps,
            className: cn(targetClassName, (targetProps as { className?: string } | undefined)?.className),
            style: { ...(targetProps as { style?: React.CSSProperties } | undefined)?.style, ...style },
        } as any,
        children,
    );

    const hasContent = content !== undefined && content !== null && content !== "";

    // Disabled or empty content: render the bare target (keeps the wrapper classname/DOM), no tooltip.
    if (disabled || !hasContent) {
        return target;
    }

    let tooltipContent: React.ReactNode = content;
    if (typeof content === "string" && typeof markdownEnabler === "string" && new RegExp(markdownEnabler).test(content)) {
        tooltipContent = <Markdown {...markdownProps}>{content}</Markdown>;
    }

    const { side, align } = parsePlacement(placement);
    const { sideOffset, alignOffset } = parseOffset(modifiers);

    const contentClassName = cn(
        tooltipContentRecipe,
        tooltipSizeMaxWidthClass[size],
        `${eccgui}-tooltip__content`,
        `${eccgui}-tooltip--${size}`,
        className ? `${className}__content` : undefined,
    );

    const handleOpenChange = (open: boolean) => {
        onInteraction?.(open);
        if (open) {
            onOpening?.();
            onOpened?.();
        } else {
            onClosing?.();
            onClose?.();
        }
    };

    return (
        <RadixTooltip.Provider delayDuration={Math.max(0, hoverOpenDelay)}>
            <RadixTooltip.Root open={isOpen} defaultOpen={defaultIsOpen} onOpenChange={handleOpenChange}>
                <RadixTooltip.Trigger asChild>{target}</RadixTooltip.Trigger>
                <RadixTooltip.Portal container={container}>
                    <RadixTooltip.Content
                        side={side}
                        align={align}
                        sideOffset={sideOffset}
                        alignOffset={alignOffset}
                        className={contentClassName}
                        style={{ zIndex: "var(--eccgui-zindex-overlays, 10001)" as unknown as number }}
                        data-tooltip-intent={intent}
                    >
                        {tooltipContent}
                        <RadixTooltip.Arrow
                            className="size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-xs bg-foreground fill-foreground"
                        />
                    </RadixTooltip.Content>
                </RadixTooltip.Portal>
            </RadixTooltip.Root>
        </RadixTooltip.Provider>
    );
};

export default Tooltip;
