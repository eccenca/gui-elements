import React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { useOverlayParent } from "@/common/overlay/OverlayParentContext";
import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";
import { TestableComponent } from "@/components/interfaces";
import { WhiteSpaceContainer, WhiteSpaceContainerProps } from "@/components/atoms/Typography";

/**
 * Structural markers emitted on the target wrapper so other code can query/style the overlay
 * state (Blueprint-free after the Blueprint → Radix migration):
 * - `eccgui-contextoverlay`: always present on the wrapper (styled by app styles, e.g.
 *   `HierarchicalMapping.scss`, and used as the anchor/target selector).
 * - `eccgui-contextoverlay--open`: added while the overlay is open; queried by `HandleDefault`
 *   (react-flow) via `classList.contains(...)` and matched by `OverviewItemActions`
 *   (`has-[.eccgui-contextoverlay--open]`).
 * - `data-state="open" | "closed"`: mirrors the Radix open-state convention on the wrapper.
 */

/**
 * Popup kind applied to the `aria-haspopup` attribute of the target wrapper.
 * Locally declared union mirroring the historical Blueprint `PopupKind` enum string values, so the
 * prop surface stays byte-compatible without depending on `@blueprintjs/core`.
 */
export type ContextOverlayPopupKind = "menu" | "listbox" | "tree" | "grid" | "dialog";

/**
 * Placement of the overlay relative to its target.
 * Keeps the historical Blueprint/popper.js placement strings for a frozen API; they are mapped
 * internally to Radix `side` + `align`. `auto*` values fall back to the default side (bottom)
 * with Radix' built-in collision-aware flipping.
 */
export type ContextOverlayPlacement =
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

/**
 * The kind of interaction that triggers the display of the overlay.
 * Mirrors Blueprint's `PopoverInteractionKind` string values, so existing code passing the
 * Blueprint constants keeps working.
 */
export type ContextOverlayInteractionKind = "click" | "click-target" | "hover" | "hover-target";

/**
 * Structural stand-in for Blueprint's popper.js `PopperModifierOverrides`.
 * Only a small subset is translated to the Radix positioning engine:
 * - `flip.enabled === false` → `avoidCollisions={false}`
 * - `offset.options.offset` (`[skidding, distance]`) → Radix `alignOffset`/`sideOffset`
 * Everything else is accepted for API compatibility but has no effect.
 */
export interface ContextOverlayPopperModifierOverrides {
    [modifierName: string]:
        | {
              enabled?: boolean;
              options?: Record<string, unknown>;
              [key: string]: unknown;
          }
        | undefined;
}

/**
 * Props passed to a custom `renderTarget` function. The returned element must attach the given
 * `ref` to its underlying DOM element so the overlay can be positioned against it.
 */
export interface ContextOverlayTargetRenderProps extends Omit<React.HTMLProps<HTMLElement>, "ref"> {
    ref?: React.Ref<HTMLElement>;
    isOpen?: boolean;
}

export interface ContextOverlayProps extends TestableComponent {
    /**
     * `target` element to use as toggler for the overlay display.
     */
    children?: React.JSX.Element;
    /**
     * The content displayed inside the overlay.
     * An empty (or missing) content only renders the target.
     */
    content?: React.ReactNode;
    /**
     * Additional CSS class names for the target wrapper element.
     */
    className?: string;
    /**
     * Additional CSS class names for the overlay (content) element.
     */
    popoverClassName?: string;
    /**
     * Historically the class name of the Blueprint portal element. The Radix portal does not
     * render an own element, so the class is now applied to the overlay content element as well.
     */
    portalClassName?: string;
    /**
     * Controlled open state of the overlay.
     */
    isOpen?: boolean;
    /**
     * Initial open state for uncontrolled usage.
     */
    defaultIsOpen?: boolean;
    /**
     * Prevents the overlay from opening (and closes an uncontrolled, open overlay).
     */
    disabled?: boolean;
    /**
     * Callback invoked in controlled mode when the overlay open state *would* change due to
     * user interaction (target click, outside click, escape key, hover in/out).
     */
    onInteraction?: (nextOpenState: boolean, e?: React.SyntheticEvent<HTMLElement>) => void;
    /**
     * Callback invoked when a user interaction causes the overlay to close.
     */
    onClose?: (e?: React.SyntheticEvent<HTMLElement>) => void;
    /** Called when the overlay starts to open. */
    onOpening?: (node: HTMLElement) => void;
    /** Called when the overlay finished opening. */
    onOpened?: (node: HTMLElement) => void;
    /** Called when the overlay starts to close. */
    onClosing?: (node: HTMLElement) => void;
    /** Called when the overlay finished closing. */
    onClosed?: (node: HTMLElement) => void;
    /**
     * The kind of interaction that triggers the display of the overlay.
     * @default "click"
     */
    interactionKind?: ContextOverlayInteractionKind;
    /**
     * Milliseconds to wait before opening on hover (hover interaction kinds only).
     * @default 150
     */
    hoverOpenDelay?: number;
    /**
     * Milliseconds to wait before closing after the pointer left target and overlay
     * (hover interaction kinds only).
     * @default 300
     */
    hoverCloseDelay?: number;
    /**
     * Whether the overlay opens when the target receives keyboard focus
     * (hover interaction kinds only).
     * @default true
     */
    openOnTargetFocus?: boolean;
    /**
     * Placement of the overlay relative to the target.
     * @default "bottom"
     */
    placement?: ContextOverlayPlacement;
    /**
     * Removes the visual offset between target and overlay (Blueprint's "no arrow" mode).
     */
    minimal?: boolean;
    /**
     * The overlay content gets the same width as the target element.
     */
    matchTargetWidth?: boolean;
    /**
     * The target wrapper is rendered as block-level `div` filling the available width.
     */
    fill?: boolean;
    /**
     * Tag name of the target wrapper element.
     * @default "span" (or "div" when `fill` is set)
     */
    targetTagName?: keyof React.JSX.IntrinsicElements;
    /**
     * Additional HTML props for the target wrapper element.
     */
    targetProps?: React.HTMLProps<HTMLElement>;
    /**
     * Custom target renderer, used instead of `children`. The render result must attach the
     * provided `ref` to its DOM element.
     */
    renderTarget?: (props: ContextOverlayTargetRenderProps) => React.JSX.Element;
    /**
     * Whether the overlay content acquires focus when it opens.
     * @default true for click interactions, false for hover interactions
     */
    autoFocus?: boolean;
    /**
     * Whether pressing the escape key closes the overlay.
     * @default true
     */
    canEscapeKeyClose?: boolean;
    /**
     * Return focus to the previously focused element when the overlay closes.
     * Closing via escape key always returns focus.
     * @default false
     */
    shouldReturnFocusOnClose?: boolean;
    /**
     * Whether the overlay content is rendered through a portal.
     * @default true
     */
    usePortal?: boolean;
    /**
     * The container element the overlay portal renders into. When omitted the nearest
     * overlay-parent container (see `OverlayParentProvider`) or `document.body` is used.
     */
    portalContainer?: HTMLElement;
    /**
     * popper.js modifier overrides, see {@link ContextOverlayPopperModifierOverrides} for the
     * translated subset.
     */
    modifiers?: ContextOverlayPopperModifierOverrides;
    /**
     * Applied to the `aria-haspopup` attribute of the target wrapper.
     * @default "menu"
     */
    popupKind?: ContextOverlayPopupKind;
    /**
     * Type of counter property to `Modal.forceTopPosition`.
     * Use it when you need to display modal dialogs out of the context overlay.
     * Lowers the overlay z-index to the modal level.
     */
    preventTopPosition?: boolean;
    /**
     * Use the overlay target as placeholder before the full overlay logic is attached on the
     * first hover, focus or click event. With the Radix implementation the overlay content is
     * always rendered lazily, so this only toggles the placeholder marker class until the first
     * interaction happens.
     */
    usePlaceholder?: boolean;
    /**
     * Adds white space to each side of the overlay content.
     * For more control use `WhiteSpaceContainer` directly as wrapper for the content children.
     */
    paddingSize?: WhiteSpaceContainerProps["paddingTop"];

    // -- accepted for API compatibility, no effect under the Radix implementation ---------------

    /**
     * @deprecated The Radix overlay never traps or re-acquires focus; no effect.
     */
    enforceFocus?: boolean;
    /**
     * @deprecated Backdrops are not rendered anymore; outside clicks are detected without them.
     */
    hasBackdrop?: boolean;
    /**
     * @deprecated No backdrop is rendered; no effect.
     */
    backdropProps?: React.HTMLProps<HTMLDivElement>;
    /**
     * @deprecated Blueprint dismiss-class capturing is not supported anymore; no effect.
     */
    captureDismiss?: boolean;
    /**
     * @deprecated Dark theme is handled globally; no effect.
     */
    inheritDarkTheme?: boolean;
    /**
     * @deprecated The overlay content is always rendered lazily; no effect.
     */
    lazy?: boolean;
    /**
     * @deprecated Transitions are CSS-driven; no effect.
     */
    transitionDuration?: number;
    /**
     * @deprecated Radix positions collision-aware against the viewport by default; no effect.
     */
    boundary?: unknown;
    /**
     * @deprecated Radix positions collision-aware against the viewport by default; no effect.
     */
    rootBoundary?: "viewport" | "document";
    /**
     * @deprecated The positioning strategy is managed by Radix; no effect.
     */
    positioningStrategy?: "absolute" | "fixed";
    /**
     * @deprecated Custom popper.js modifiers are not supported anymore; no effect.
     */
    modifiersCustom?: readonly unknown[];
    /**
     * @deprecated There is no portal element anymore events could be re-dispatched from; no effect.
     */
    portalStopPropagationEvents?: string[];
}

type RadixSide = "top" | "right" | "bottom" | "left";
type RadixAlign = "start" | "center" | "end";

/** Map a Blueprint/popper placement string onto Radix `side` + `align`. */
const parsePlacement = (placement?: ContextOverlayPlacement): { side?: RadixSide; align: RadixAlign } => {
    const [sideRaw, alignRaw] = (placement ?? "").split("-");
    const align: RadixAlign = alignRaw === "start" ? "start" : alignRaw === "end" ? "end" : "center";
    if (!placement || placement.startsWith("auto")) {
        // Radix defaults to `side="bottom"` and flips collision-aware, matching "auto".
        return { align };
    }
    const side = (["top", "right", "bottom", "left"] as string[]).includes(sideRaw)
        ? (sideRaw as RadixSide)
        : undefined;
    return { side, align };
};

/** Translate a Blueprint `offset` popper modifier (`[skidding, distance]`) to Radix offsets. */
const parseOffsetModifier = (
    modifiers?: ContextOverlayPopperModifierOverrides,
): { sideOffset?: number; alignOffset?: number } => {
    const offset = modifiers?.offset?.options?.offset;
    if (Array.isArray(offset) && typeof offset[1] === "number") {
        return { alignOffset: typeof offset[0] === "number" ? offset[0] : 0, sideOffset: offset[1] };
    }
    return {};
};

/**
 * shadcn/ui popover content recipe (style: new-york-v4) without the fixed `z-50 w-72 p-4` (the
 * z-index is driven by the shared `--eccgui-zindex-*` custom properties, size and padding are
 * owned by the overlay content like with the previous Blueprint popover).
 */
const overlayContentRecipe =
    // `border-border` is required alongside the bare `border` utility: this project's preflight
    // resets `border-color` to its CSS-initial `currentcolor` (no stock-shadcn `* { border-border }`
    // global reset backs it here, see `src/tailwind/base.css`), so a bare `border` would otherwise
    // pick up `text-popover-foreground` as its color instead of the intended pale `--border` hairline.
    "origin-(--radix-popover-content-transform-origin) rounded-md border border-border bg-popover text-popover-foreground " +
    "shadow-md outline-hidden data-[state=open]:animate-in data-[state=open]:fade-in-0 " +
    "data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 " +
    "data-[state=closed]:zoom-out-95";

/**
 * Element displays connected content by interacting with a target element.
 * The generic anchor/overlay engine of the library, rebuilt on the Radix popover primitive with
 * a Blueprint-compatible prop surface.
 */
export const ContextOverlay = ({
    children,
    content,
    className = "",
    popoverClassName,
    portalClassName,
    isOpen,
    defaultIsOpen = false,
    disabled = false,
    onInteraction,
    onClose,
    onOpening,
    onOpened,
    onClosing,
    onClosed,
    interactionKind = "click",
    hoverOpenDelay = 150,
    hoverCloseDelay = 300,
    openOnTargetFocus = true,
    placement = "bottom",
    minimal = false,
    matchTargetWidth = false,
    fill = false,
    targetTagName,
    targetProps,
    renderTarget,
    autoFocus,
    canEscapeKeyClose = true,
    shouldReturnFocusOnClose = false,
    usePortal = true,
    portalContainer,
    modifiers,
    popupKind,
    preventTopPosition = false,
    usePlaceholder = false,
    paddingSize,
    "data-test-id": dataTestId,
    "data-testid": dataTestid,
    // deprecated / no-op props — destructured so they never leak anywhere
    enforceFocus: _enforceFocus,
    hasBackdrop: _hasBackdrop,
    backdropProps: _backdropProps,
    captureDismiss: _captureDismiss,
    inheritDarkTheme: _inheritDarkTheme,
    lazy: _lazy,
    transitionDuration: _transitionDuration,
    boundary: _boundary,
    rootBoundary: _rootBoundary,
    positioningStrategy: _positioningStrategy,
    modifiersCustom: _modifiersCustom,
    portalStopPropagationEvents: _portalStopPropagationEvents,
}: ContextOverlayProps) => {
    const overlayParent = useOverlayParent();
    const container = portalContainer ?? overlayParent;

    const hoverKind = interactionKind === "hover" || interactionKind === "hover-target";
    const hasContent = content !== undefined && content !== null && content !== "";
    const controlled = isOpen != null;

    const [uncontrolledOpen, setUncontrolledOpen] = React.useState<boolean>(!disabled && defaultIsOpen);
    const open = !disabled && hasContent && (controlled ? !!isOpen : uncontrolledOpen);

    const [placeholderActive, setPlaceholderActive] = React.useState<boolean>(
        // use placeholder only for "simple" overlays without special states
        usePlaceholder && !disabled && !defaultIsOpen && !isOpen && renderTarget === undefined,
    );

    const wrapperRef = React.useRef<HTMLElement | null>(null);
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const escapeCloseRef = React.useRef(false);
    const openerElementRef = React.useRef<HTMLElement | null>(null);

    // Volatile props/state accessed from event handlers and native listeners without
    // re-subscribing them on every render.
    const latest = React.useRef({
        open,
        controlled,
        isOpen: !!isOpen,
        disabled,
        hasContent,
        interactionKind,
        hoverOpenDelay,
        hoverCloseDelay,
        openOnTargetFocus,
        autoFocus,
        canEscapeKeyClose,
        shouldReturnFocusOnClose,
        onInteraction,
        onClose,
    });
    latest.current = {
        open,
        controlled,
        isOpen: !!isOpen,
        disabled,
        hasContent,
        interactionKind,
        hoverOpenDelay,
        hoverCloseDelay,
        openOnTargetFocus,
        autoFocus,
        canEscapeKeyClose,
        shouldReturnFocusOnClose,
        onInteraction,
        onClose,
    };

    const clearOpenTimer = React.useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    /**
     * Applies the next open state like Blueprint's `setOpenState`: uncontrolled overlays update
     * their own state, controlled overlays only notify via `onInteraction`; `onClose` fires on
     * every close interaction in both modes.
     */
    const applyOpenState = React.useCallback((nextOpen: boolean, e?: React.SyntheticEvent<HTMLElement>) => {
        const props = latest.current;
        if (nextOpen && (props.disabled || !props.hasContent)) {
            return;
        }
        if (nextOpen && !props.open) {
            openerElementRef.current = (document.activeElement as HTMLElement | null) ?? null;
        }
        if (!props.controlled) {
            setUncontrolledOpen(nextOpen);
        } else {
            props.onInteraction?.(nextOpen, e);
        }
        if (!nextOpen) {
            props.onClose?.(e);
        }
    }, []);

    /** Schedules (or immediately applies) an open state change; any new interaction cancels a pending one. */
    const setOpenState = React.useCallback(
        (nextOpen: boolean, e?: React.SyntheticEvent<HTMLElement>, delay?: number) => {
            clearOpenTimer();
            if (delay !== undefined && delay > 0) {
                timerRef.current = setTimeout(() => {
                    timerRef.current = null;
                    applyOpenState(nextOpen, e);
                }, delay);
            } else {
                applyOpenState(nextOpen, e);
            }
        },
        [applyOpenState, clearOpenTimer],
    );

    // cleanup pending timers on unmount
    React.useEffect(() => clearOpenTimer, [clearOpenTimer]);

    // keep the internal state in sync while controlled, so a controlled → uncontrolled switch
    // (e.g. `isOpen={condition ? true : undefined}`) continues from the last controlled value
    React.useEffect(() => {
        if (isOpen != null) {
            setUncontrolledOpen(isOpen);
        }
    }, [isOpen]);

    // close an uncontrolled overlay when it gets disabled (Blueprint behavior)
    React.useEffect(() => {
        if (disabled && !latest.current.controlled && latest.current.open) {
            setOpenState(false);
        }
    }, [disabled, setOpenState]);

    /**
     * Open/close lifecycle: fires `onOpening`/`onOpened` and `onClosing`/`onClosed` on state
     * transitions (including an initially open mount), mirroring the Blueprint overlay lifecycle.
     */
    const lifecycleRef = React.useRef({ onOpening, onOpened, onClosing, onClosed });
    lifecycleRef.current = { onOpening, onOpened, onClosing, onClosed };
    const prevOpenRef = React.useRef(false);
    React.useEffect(() => {
        if (prevOpenRef.current === open) {
            return;
        }
        prevOpenRef.current = open;
        const callbacks = lifecycleRef.current;
        const node = (contentRef.current ?? wrapperRef.current ?? document.body) as HTMLElement;
        if (open) {
            callbacks.onOpening?.(node);
            callbacks.onOpened?.(node);
        } else {
            callbacks.onClosing?.(node);
            callbacks.onClosed?.(node);
        }
    }, [open]);

    /**
     * Target click handling for the click interaction kinds, mirroring Blueprint's
     * `handleTargetClick`: uncontrolled overlays toggle silently (no callbacks), controlled
     * overlays fire `onInteraction` (+ `onClose` when closing).
     */
    const handleTargetClick = React.useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            setPlaceholderActive(false);
            const props = latest.current;
            if (props.disabled || !props.hasContent) {
                return;
            }
            // ignore clicks bubbling from an inline-rendered overlay content
            if (contentRef.current && contentRef.current.contains(e.target as Node)) {
                return;
            }
            clearOpenTimer();
            if (!props.controlled) {
                openerElementRef.current = (document.activeElement as HTMLElement | null) ?? null;
                setUncontrolledOpen((previous) => !previous);
            } else {
                const nextOpen = !props.isOpen;
                props.onInteraction?.(nextOpen, e);
                if (!nextOpen) {
                    props.onClose?.(e);
                }
            }
        },
        [clearOpenTimer],
    );

    /**
     * Hover/focus interactions are attached as native listeners on the target wrapper element:
     * `mouseenter`/`mouseleave` do not bubble, so per-element native listeners behave identically
     * in real browsers and with events dispatched directly in tests.
     */
    React.useEffect(() => {
        const node = wrapperRef.current;
        if (!node || !hoverKind) {
            return;
        }
        const handleEnter = () => {
            setPlaceholderActive(false);
            if (latest.current.disabled) {
                return;
            }
            setOpenState(true, undefined, latest.current.hoverOpenDelay);
        };
        const handleLeave = () => {
            setOpenState(false, undefined, latest.current.hoverCloseDelay);
        };
        const handleFocusIn = () => {
            if (latest.current.openOnTargetFocus) {
                handleEnter();
            }
        };
        const handleFocusOut = (ev: FocusEvent) => {
            if (!latest.current.openOnTargetFocus) {
                return;
            }
            const related = ev.relatedTarget as Node | null;
            if (related && (node.contains(related) || contentRef.current?.contains(related))) {
                return;
            }
            handleLeave();
        };
        node.addEventListener("mouseenter", handleEnter);
        node.addEventListener("mouseleave", handleLeave);
        node.addEventListener("focusin", handleFocusIn);
        node.addEventListener("focusout", handleFocusOut);
        return () => {
            node.removeEventListener("mouseenter", handleEnter);
            node.removeEventListener("mouseleave", handleLeave);
            node.removeEventListener("focusin", handleFocusIn);
            node.removeEventListener("focusout", handleFocusOut);
        };
    }, [hoverKind, targetTagName, fill, setOpenState]);

    // -- target wrapper --------------------------------------------------------------------------

    const TargetTag = (targetTagName ?? (fill ? "div" : "span")) as React.ElementType;
    const clickKind = !hoverKind;

    const wrapperClassName = cn(
        `${eccgui}-contextoverlay`,
        // former `span.eccgui-contextoverlay { display: inline-block; max-width: 100% }` /
        // `.eccgui-contextoverlay--fill { display: block; width: 100% }` (contextoverlay.scss)
        fill ? "block w-full" : "inline-block max-w-full",
        className || undefined,
        open && `${eccgui}-contextoverlay--open`,
        fill && `${eccgui}-contextoverlay--fill`,
        placeholderActive && `${eccgui}-contextoverlay__wrapper--placeholder`,
        (targetProps as { className?: string } | undefined)?.className,
    );

    const wrapperRefCallback = React.useCallback((node: HTMLElement | null) => {
        wrapperRef.current = node;
    }, []);

    const sharedTargetProps = {
        className: wrapperClassName,
        ref: wrapperRefCallback,
        "data-state": open ? "open" : "closed",
        tabIndex:
            (targetProps as { tabIndex?: number } | undefined)?.tabIndex ??
            (hoverKind && openOnTargetFocus && !disabled && hasContent ? 0 : undefined),
        "aria-expanded": clickKind && hasContent ? open : undefined,
        "aria-haspopup": (hasContent && interactionKind !== "hover-target"
            ? (popupKind ?? "menu")
            : undefined) as React.AriaAttributes["aria-haspopup"],
        "data-test-id": dataTestId,
        "data-testid": dataTestid,
    };

    const handleWrapperClick = (e: React.MouseEvent<HTMLElement>) => {
        if (clickKind) {
            handleTargetClick(e);
        } else {
            setPlaceholderActive(false);
        }
        (targetProps as { onClick?: React.MouseEventHandler<HTMLElement> } | undefined)?.onClick?.(e);
    };

    // `createElement` (instead of JSX) avoids TS checking the props against every possible
    // intrinsic element of the `ElementType` union.
    const target = renderTarget
        ? renderTarget({ ...sharedTargetProps, isOpen: open, onClick: clickKind ? handleTargetClick : undefined })
        : React.createElement(
              TargetTag,
              {
                  ...(targetProps as object | undefined),
                  ...sharedTargetProps,
                  onClick: handleWrapperClick,
              } as Record<string, unknown>,
              children,
          );

    // -- overlay content --------------------------------------------------------------------------

    const { side, align } = parsePlacement(placement);
    const { sideOffset, alignOffset } = parseOffsetModifier(modifiers);
    // Blueprint's `flip` modifier could be disabled to enforce the configured side.
    const avoidCollisions = modifiers?.flip?.enabled !== false;

    const contentClassName = cn(
        overlayContentRecipe,
        `${eccgui}-contextoverlay__content`,
        minimal && `${eccgui}-contextoverlay__content--minimal`,
        popoverClassName,
        portalClassName,
    );

    const contentStyle: React.CSSProperties = {
        // the Radix popper wrapper element copies the z-index of the content element
        zIndex: (preventTopPosition
            ? "var(--eccgui-zindex-modals, 8001)"
            : "var(--eccgui-zindex-overlays, 10001)") as unknown as number,
        ...(matchTargetWidth ? { width: "var(--radix-popover-trigger-width)" } : {}),
    };

    const contentRefCallback = React.useCallback((node: HTMLDivElement | null) => {
        contentRef.current = node;
    }, []);

    const overlayContent = hasContent ? (
        <PopoverPrimitive.Content
            ref={contentRefCallback}
            side={side}
            align={align}
            sideOffset={sideOffset ?? (minimal ? 0 : 8)}
            alignOffset={alignOffset ?? 0}
            avoidCollisions={avoidCollisions}
            className={contentClassName}
            style={contentStyle}
            onOpenAutoFocus={(ev) => {
                ev.preventDefault();
                const effectiveAutoFocus = latest.current.autoFocus ?? !hoverKind;
                if (effectiveAutoFocus) {
                    // focus the overlay container itself (like the Blueprint overlay), not the
                    // first tabbable element inside it (the Radix default)
                    contentRef.current?.focus({ preventScroll: true });
                }
            }}
            onCloseAutoFocus={(ev) => {
                // never let Radix jump focus around on its own …
                ev.preventDefault();
                const returnFocus = escapeCloseRef.current || latest.current.shouldReturnFocusOnClose;
                escapeCloseRef.current = false;
                // … but return it to the opener after escape-close or when explicitly requested
                if (returnFocus) {
                    const opener = openerElementRef.current;
                    if (opener && document.contains(opener)) {
                        opener.focus({ preventScroll: true });
                    }
                }
            }}
            onEscapeKeyDown={() => {
                if (!latest.current.canEscapeKeyClose) {
                    return;
                }
                escapeCloseRef.current = true;
                setOpenState(false);
            }}
            onPointerDownOutside={(ev) => {
                const eventTarget = ev.target as Node | null;
                // clicks inside the target are handled by the target's own click handler
                if (eventTarget && wrapperRef.current?.contains(eventTarget)) {
                    return;
                }
                // Blueprint closes on outside clicks only for the plain "click" interaction kind
                if (latest.current.interactionKind === "click") {
                    setOpenState(false);
                }
            }}
            onMouseEnter={
                interactionKind === "hover"
                    ? () => setOpenState(true, undefined, latest.current.hoverOpenDelay)
                    : undefined
            }
            onMouseLeave={
                interactionKind === "hover"
                    ? () => setOpenState(false, undefined, latest.current.hoverCloseDelay)
                    : undefined
            }
        >
            {paddingSize ? (
                <WhiteSpaceContainer
                    paddingTop={paddingSize}
                    paddingRight={paddingSize}
                    paddingBottom={paddingSize}
                    paddingLeft={paddingSize}
                >
                    {content}
                </WhiteSpaceContainer>
            ) : (
                content
            )}
        </PopoverPrimitive.Content>
    ) : null;

    return (
        <PopoverPrimitive.Root open={open} modal={false}>
            {/* the wrapper element rendered above acts as (virtual) anchor — this avoids any
                ref-forwarding requirements on the target children */}
            <PopoverPrimitive.Anchor virtualRef={wrapperRef as React.RefObject<HTMLElement>} />
            {target}
            {overlayContent ? (
                usePortal ? (
                    <PopoverPrimitive.Portal container={container}>{overlayContent}</PopoverPrimitive.Portal>
                ) : (
                    overlayContent
                )
            ) : null}
        </PopoverPrimitive.Root>
    );
};

export default ContextOverlay;
