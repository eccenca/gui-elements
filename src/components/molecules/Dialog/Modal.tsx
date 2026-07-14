import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { preventReactFlowActionsClasses } from "@/cmem";
import { utils } from "@/common";
import { OverlayParentProvider, useOverlayParent } from "@/common/overlay/OverlayParentContext";
import { cn } from "@/common/utils/cn";
import { TestableComponent } from "@/components/interfaces";
import { Card } from "@/components/molecules/Card";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

import { ModalContext } from "./ModalContext";

/**
 * Props that were formerly inherited from the BlueprintJS `Overlay2` element.
 * They are re-declared locally (same names, same types, same defaults) so that the public
 * API of `Modal` stays frozen while the implementation is based on Radix UI.
 */
export interface ModalOverlayProps {
    /**
     * Toggles the visibility of the modal and its children.
     * This prop is required because the component is controlled.
     */
    isOpen: boolean;
    /**
     * A space-delimited list of class names to pass along to the dialog wrapper element.
     */
    className?: string;
    /**
     * Whether the modal should acquire application focus when it first opens.
     */
    autoFocus?: boolean;
    /**
     * Whether pressing the `esc` key should invoke `onClose`.
     */
    canEscapeKeyClose?: boolean;
    /**
     * Whether clicking outside the modal element (on the backdrop when present) should invoke `onClose`.
     */
    canOutsideClickClose?: boolean;
    /**
     * Whether the modal should prevent focus from leaving itself.
     * That is, if the user attempts to focus an element outside the modal and this prop is enabled,
     * then the modal will immediately bring focus back to itself.
     */
    enforceFocus?: boolean;
    /**
     * Whether a container-spanning backdrop element should be rendered behind the contents.
     * Note: kept for type compatibility — the effective value is always derived from
     * `preventBackdrop` (this mirrors the historical behavior where `Modal` overwrote the
     * inherited `hasBackdrop` property).
     */
    hasBackdrop?: boolean;
    /**
     * If `true`, the modal content is only mounted to the DOM while it is open.
     * Note: with the Radix based implementation content is always mounted lazily, the property is
     * kept for API compatibility.
     */
    lazy?: boolean;
    /**
     * Whether the application should return focus to the last active element in the document after
     * this modal closes.
     */
    shouldReturnFocusOnClose?: boolean;
    /**
     * Indicates how long (in milliseconds) the modal's enter/leave transition takes.
     * Also used as the animation duration of the open/close transitions.
     */
    transitionDuration?: number;
    /**
     * Name of the CSS transition.
     * Note: kept for API compatibility, transitions are handled by utility classes now.
     */
    transitionName?: string;
    /**
     * Whether the modal should be wrapped in a portal element which is attached to
     * `portalContainer` (or an overlay parent element, or `document.body`).
     */
    usePortal?: boolean;
    /**
     * Space-delimited string of class names applied to the portal element.
     */
    portalClassName?: string;
    /**
     * The container element into which the modal renders its contents, when `usePortal` is `true`.
     */
    portalContainer?: HTMLElement;
    /**
     * A list of DOM events which should be stopped from propagating through the portal.
     * Note: deprecated already with the former BlueprintJS implementation, kept for API
     * compatibility, unused.
     */
    portalStopPropagationEvents?: Array<keyof HTMLElementEventMap>;
    /**
     * CSS class names to apply to the backdrop element.
     */
    backdropClassName?: string;
    /**
     * HTML props for the backdrop element.
     */
    backdropProps?: React.HTMLProps<HTMLDivElement>;
    /**
     * A callback that is invoked when user interaction causes the modal to close, such as clicking
     * on the backdrop or pressing the `esc` key (if enabled).
     * Receives the event from the user's interaction. Note that, since this component is controlled
     * by the `isOpen` prop, it will not actually close itself until that prop becomes `false`.
     */
    onClose?: (event: React.SyntheticEvent<HTMLElement>) => void;
    /**
     * Lifecycle method invoked just before the CSS _close_ transition begins.
     * Receives the DOM element of the modal container.
     */
    onClosing?: (node: HTMLElement) => void;
    /**
     * Lifecycle method invoked just after the CSS _close_ transition ends.
     * Receives the DOM element of the modal container.
     */
    onClosed?: (node: HTMLElement) => void;
    /**
     * Lifecycle method invoked just after mounting the modal in the DOM, before the CSS _open_
     * transition begins. Receives the DOM element of the modal container.
     */
    onOpening?: (node: HTMLElement) => void;
    /**
     * Lifecycle method invoked just after the CSS _open_ transition ends.
     * Receives the DOM element of the modal container.
     */
    onOpened?: (node: HTMLElement) => void;
    /**
     * Note: kept for API compatibility with the former BlueprintJS `Overlay2` element, unused.
     */
    childRef?: React.RefObject<HTMLElement>;
    /**
     * Note: kept for API compatibility with the former BlueprintJS `Overlay2` element, unused.
     */
    childRefs?: Record<string, React.RefObject<HTMLElement>>;
}

export interface ModalProps extends TestableComponent, ModalOverlayProps {
    children: React.ReactNode | React.ReactNode[];
    /**
     * A space-delimited list of class names to pass along to the overlay element that is used to create the modal.
     */
    overlayClassName?: string;
    /**
     * Size of the modal.
     */
    size?: ModalSize;
    /**
     * Prevents that a backdrop area is displayed behind the modal elements.
     */
    preventBackdrop?: boolean;
    /**
     * Optional props for the wrapper div element inside the modal overlay.
     */
    wrapperDivProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    /**
     * Make the modal focusable, e.g. when clicking somewhere on it.
     * This is needed, e.g. when capturing key (down, up) events that should bubble to the modal's parent elements.
     */
    modalFocusable?: boolean;
    /**
     * Works only for modals inside portals (`usePortal={true}`).
     * When set to `true` then the `z-index` of the modal's portal element is recalculated, so that the modal is always shown on top of all other visible elements.
     * Use this with care!
     * Usually the normal opening sequence is enough to show the currently most important modal on top.
     * If this option is used inflationary then this could harm the visibility of other overlays.
     */
    forceTopPosition?: boolean;
    /**
     * Modal ID that should be globally unique. If a ModalContext is provided this can be used to track opening/closing of this modal.
     */
    modalId?: string;
    /**
     * Prevents that pan and zooming actions of an existing react-flow instance are triggered while this Modal is open.
     */
    preventReactFlowEvents?: boolean;
}

export type ModalSize = "tiny" | "small" | "regular" | "large" | "xlarge" | "fullscreen";

/**
 * Tailwind classes replacing the former `dialog.scss` size rules.
 * Each named size is a fluid `w-full` capped at a fixed max-width breakpoint, so dialogs no
 * longer balloon on wide screens (the former implementation used viewport-relative `vw` widths,
 * e.g. `xlarge` rendered at 75% of the viewport width no matter how wide that viewport was).
 * The wrapper's own `max-w-[calc(100vw-4rem)]` (see `overlayRoot` below) still keeps the dialog
 * clear of the viewport edges on narrow screens.
 */
const sizeClasses: Record<ModalSize, string> = {
    tiny: "w-full max-w-md",
    small: "w-full max-w-xl",
    regular: "w-full max-w-2xl",
    large: "w-full max-w-4xl",
    xlarge: "w-full max-w-6xl",
    fullscreen: "m-0 box-border w-screen max-w-[100vw] h-screen max-h-[100vh] p-[var(--eccgui-size-block-whitespace)]",
};

/**
 * Body scroll lock, replacing the former BlueprintJS behavior of adding an "overlay open" class to
 * the `body` element (that set `overflow: hidden`) while at least one modal with a backdrop and a
 * portal is open. Reference counted, so stacked modals behave correctly.
 */
let bodyScrollLocks = 0;
let bodyOverflowBeforeLock: string | undefined;
const lockBodyScroll = () => {
    if (++bodyScrollLocks === 1) {
        bodyOverflowBeforeLock = document.body.style.overflow;
        document.body.style.overflow = "hidden";
    }
};
const unlockBodyScroll = () => {
    if (bodyScrollLocks > 0 && --bodyScrollLocks === 0) {
        document.body.style.overflow = bodyOverflowBeforeLock ?? "";
        bodyOverflowBeforeLock = undefined;
    }
};

/**
 * Displays contents on top of other elements, used to create dialogs.
 * For most situations the usage of `SimpleDialog` and `AlertDialog` should be sufficient.
 * Otherwise this element can be used to create own modal elements and edge cases for modal dialogs.
 * Then it is recommended to use the `Card` element inside.
 *
 * Implementation notes (BlueprintJS → Radix migration):
 *
 * The modal is built on `@radix-ui/react-dialog` but intentionally uses `modal={false}`.
 * Radix' modal mode applies `aria-hidden` and `pointer-events: none` to everything outside of the
 * dialog content (plus its own scroll lock via `react-remove-scroll`). During the migration period
 * dialog content still renders BlueprintJS based overlays (`Select`, autocomplete popovers, etc.)
 * that are portaled to `document.body`, i.e. *outside* the Radix content — modal mode would make
 * them unclickable and hide them from the accessibility tree. Therefore the "modal affordances"
 * are provided manually and match the former BlueprintJS `Overlay2` semantics:
 *
 * - own backdrop element (`canOutsideClickClose` → `onClose` on backdrop mouse down),
 * - own body scroll lock while open (with backdrop + portal, like Blueprint),
 * - own focus management: `autoFocus` brings focus onto the dialog container (not the first input,
 *   matching Blueprint and avoiding side effects like auto-opened dropdowns), `enforceFocus`
 *   re-captures focus via a document "focus" capture listener, `shouldReturnFocusOnClose` restores
 *   the element that was focused before opening,
 * - own Escape handling via Radix' `onEscapeKeyDown` (which only fires for the top-most Radix
 *   layer, so overlays that are opened *inside* the dialog and are Radix based close first).
 *   All built-in Radix dismissal paths (`onInteractOutside` etc.) are suppressed so `onClose` is
 *   the single notification channel for every close intent, as before.
 *
 * Nested overlays: the dialog wraps its children into an `OverlayParentProvider` carrying the
 * dialog wrapper element, so nested overlay portals (menus, selects, tooltips, nested modals) can
 * mount *inside* the dialog for correct stacking and focus behavior. The modal itself portals into
 * `portalContainer` ?? `useOverlayParent()` ?? `document.body`, so nested modals stack correctly.
 */
export const Modal = ({
    children,
    className = "",
    overlayClassName = "",
    size = "regular",
    canOutsideClickClose = false,
    canEscapeKeyClose = false,
    preventBackdrop = false,
    wrapperDivProps,
    modalFocusable = true,
    usePortal = true,
    forceTopPosition = false,
    onOpening,
    onOpened,
    onClosing,
    onClosed,
    onClose,
    "data-test-id": dataTestId,
    "data-testid": dataTestid,
    modalId,
    preventReactFlowEvents = true,
    isOpen,
    autoFocus = true,
    enforceFocus = true,
    shouldReturnFocusOnClose = true,
    transitionDuration = 200,
    portalClassName = "",
    portalContainer,
    backdropClassName,
    backdropProps,
}: ModalProps) => {
    const modalContext = React.useContext(ModalContext);
    const overlayParent = useOverlayParent();
    const uniqueModalId = React.useRef<string>(
        modalId ?? Date.now().toString(36) + Math.random().toString(36).substring(2),
    );

    // the portal element carrying the `${eccgui}-dialog__portal` class name (only with `usePortal`)
    const portalRef = React.useRef<HTMLDivElement | null>(null);
    // the overlay root element containing backdrop and container
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    // the container element, equivalent to the former Blueprint "dialog container"
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    // the wrapper (dialog surface parent) element, provided as parent for nested overlays
    const [wrapperElement, setWrapperElement] = React.useState<HTMLElement | null>(null);
    // element that had focus before the modal was opened
    const lastActiveElementRef = React.useRef<HTMLElement | null>(null);
    const everOpenedRef = React.useRef(false);

    // always call the latest callbacks from the (intentionally minimal dependency) effects below
    const callbacksRef = React.useRef({ onOpening, onOpened, onClosing, onClosed, onClose });
    callbacksRef.current = { onOpening, onOpened, onClosing, onClosed, onClose };
    const volatilePropsRef = React.useRef({ autoFocus, forceTopPosition, usePortal, transitionDuration });
    volatilePropsRef.current = { autoFocus, forceTopPosition, usePortal, transitionDuration };

    const effectiveHasBackdrop = !preventBackdrop;

    React.useEffect(() => {
        return () => {
            // Make sure to always remove flag when modal is removed
            modalContext.setModalOpen(uniqueModalId.current, false);
        };
    }, []);

    React.useEffect(() => {
        modalContext.setModalOpen(uniqueModalId.current, isOpen);
    }, [isOpen]);

    /**
     * Open/close lifecycle: fires the `onOpening`/`onOpened`/`onClosing`/`onClosed` callbacks with
     * the container element (like the former Blueprint implementation did with its transition
     * child) and applies the `forceTopPosition` z-index recalculation on the portal element.
     */
    React.useEffect(() => {
        const { onOpening, onOpened, onClosing, onClosed } = callbacksRef.current;
        const { autoFocus, forceTopPosition, usePortal, transitionDuration } = volatilePropsRef.current;
        if (isOpen) {
            everOpenedRef.current = true;
            lastActiveElementRef.current = (document.activeElement as HTMLElement | null) ?? null;
            const node = containerRef.current;
            if (node) {
                onOpening?.(node);
            }
            if (usePortal && forceTopPosition && portalRef.current) {
                // Recalculate the z-index of the portal element so the modal is displayed on top of
                // all other (modal) overlays. The baseline is the computed value of the
                // `--eccgui-zindex-modals` custom property set as inline style on the portal.
                const parentalPortal = portalRef.current;
                const highestTopIndex = (utils.getGlobalVar("highestModalTopIndex") as unknown as number) ?? 0;
                const portalTopIndex = parseInt(getComputedStyle(parentalPortal).zIndex ?? "0", 10) || 0;
                const newTopIndex = Math.max(portalTopIndex, highestTopIndex) + 1;
                parentalPortal.style.zIndex = `${newTopIndex}`;
                utils.setGlobalVar("highestModalTopIndex", newTopIndex);
            }
            if (autoFocus) {
                // Blueprint parity: bring focus onto the dialog (container) itself, delayed to just
                // before repaint to prevent scroll jumping. We deliberately do not focus the first
                // form element to avoid side effects like automatically opened dropdowns.
                requestAnimationFrame(() => {
                    const container = containerRef.current;
                    const scope = portalRef.current ?? rootRef.current;
                    const activeElement = document.activeElement;
                    if (container && scope && (!activeElement || !scope.contains(activeElement))) {
                        container.focus({ preventScroll: true });
                    }
                });
            }
            const openedTimeout = window.setTimeout(() => {
                const el = containerRef.current;
                if (el) {
                    onOpened?.(el);
                }
            }, transitionDuration);
            return () => window.clearTimeout(openedTimeout);
        } else if (everOpenedRef.current) {
            // the container element stays mounted during the exit transition (Radix `Presence`)
            const node = containerRef.current;
            if (node) {
                onClosing?.(node);
            }
            const closedTimeout = window.setTimeout(() => {
                if (node) {
                    onClosed?.(node);
                }
            }, transitionDuration);
            return () => window.clearTimeout(closedTimeout);
        }
        return;
    }, [isOpen]);

    /**
     * Body scroll lock while open, equivalent to the former Blueprint behavior
     * (only applied for portal-ed modals with a backdrop).
     */
    React.useEffect(() => {
        if (isOpen && usePortal && effectiveHasBackdrop) {
            lockBodyScroll();
            return unlockBodyScroll;
        }
        return;
    }, [isOpen, usePortal, effectiveHasBackdrop]);

    /**
     * `enforceFocus`: bring focus back inside the modal whenever it moves outside of it.
     * Same mechanism as Blueprint (document "focus" listener in the capture phase).
     * Note that overlays portaled *into* the dialog (see `OverlayParentProvider`) are inside the
     * checked subtree, while overlays portaled to `document.body` will have focus captured away —
     * this matches the previous behavior (which is why `SimpleDialog` defaults to
     * `enforceFocus={false}`).
     */
    React.useEffect(() => {
        if (!isOpen || !enforceFocus) {
            return;
        }
        const handleDocumentFocus = (event: FocusEvent) => {
            const eventTarget = event.composed ? event.composedPath()[0] : event.target;
            const scope = portalRef.current ?? rootRef.current;
            if (scope && eventTarget instanceof Node && !scope.contains(eventTarget)) {
                // prevent default focus behavior (sometimes auto-scrolls the page)
                event.preventDefault();
                event.stopImmediatePropagation();
                containerRef.current?.focus({ preventScroll: true });
            }
        };
        document.addEventListener("focus", handleDocumentFocus, true);
        return () => document.removeEventListener("focus", handleDocumentFocus, true);
    }, [isOpen, enforceFocus]);

    /**
     * `canOutsideClickClose` without a backdrop: close on document-level mouse down outside of the
     * modal (with a backdrop the backdrop mouse down handler is responsible instead).
     * Note: unlike the Blueprint overlay-stack based check, overlays that are portaled to
     * `document.body` from inside the dialog count as "outside" here — overlays portaled into the
     * dialog (the default for migrated components via `OverlayParentProvider`) are fine.
     */
    React.useEffect(() => {
        if (!isOpen || !canOutsideClickClose || effectiveHasBackdrop) {
            return;
        }
        const handleDocumentMousedown = (event: MouseEvent) => {
            const eventTarget = event.composed ? event.composedPath()[0] : event.target;
            const scope = rootRef.current;
            if (scope && eventTarget instanceof Node) {
                const insideModal = scope.contains(eventTarget) && !scope.isSameNode(eventTarget);
                if (!insideModal) {
                    callbacksRef.current.onClose?.(event as unknown as React.SyntheticEvent<HTMLElement>);
                }
            }
        };
        document.addEventListener("mousedown", handleDocumentMousedown);
        return () => document.removeEventListener("mousedown", handleDocumentMousedown);
    }, [isOpen, canOutsideClickClose, effectiveHasBackdrop]);

    const alteredChildren = React.Children.map(children, (child) => {
        if ((child as React.ReactElement).type && (child as React.ReactElement).type === Card) {
            return React.cloneElement(child as React.ReactElement<{ isOnlyLayout?: boolean; elevation?: number }>, {
                isOnlyLayout: true,
                elevation: 4,
            });
        }

        return child;
    });

    /**
     * Escape key handling. Radix only invokes this callback when this dialog is the top-most Radix
     * layer, i.e. Radix based overlays opened inside the dialog (menus, popovers, nested modals)
     * handle the Escape press first — equivalent to the former overlay-stack behavior.
     * The default Radix dismissal is always prevented; `onClose` is our single close channel.
     */
    const handleEscapeKeyDown = (event: KeyboardEvent) => {
        // We own the dismissal semantics completely (also prevents browser specific Escape
        // behavior like Safari exiting fullscreen, as the Blueprint implementation did).
        event.preventDefault();
        if (!canEscapeKeyClose) {
            return;
        }
        const scope = portalRef.current ?? rootRef.current;
        const target = event.target;
        if (!(target instanceof Node) || !scope) {
            return;
        }
        if (scope.contains(target)) {
            // If focus sits inside a foreign (non-Radix) overlay portal that was mounted *into*
            // the dialog (e.g. a Blueprint popover with a `portalContainer` inside the modal),
            // that overlay owns the Escape press and closes itself — do not close the dialog.
            // Blueprint portal elements carry a `<ns>-portal` class name; our own portal class
            // (`…-dialog__portal`) does not match the `-portal` substring selector.
            const nestedForeignPortal = target instanceof Element ? target.closest('[class*="-portal"]') : null;
            if (nestedForeignPortal && nestedForeignPortal !== portalRef.current) {
                return;
            }
            onClose?.(event as unknown as React.SyntheticEvent<HTMLElement>);
        } else if (volatilePropsRef.current.autoFocus === false) {
            // Blueprint parity: overlays that never took focus (`autoFocus={false}`) also close on
            // a document-level Escape — but only when they are the top-most tracked modal.
            const stack = modalContext.openModalStack() ?? [];
            if (stack.length === 0 || stack[stack.length - 1] === uniqueModalId.current) {
                onClose?.(event as unknown as React.SyntheticEvent<HTMLElement>);
            }
        }
        // else: focus is inside another overlay that is portaled to `document.body` (e.g. a
        // Blueprint Select popover) — that overlay handles Escape itself, the dialog stays open.
    };

    const handleBackdropMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        if (canOutsideClickClose) {
            onClose?.(event);
        }
        if (enforceFocus) {
            containerRef.current?.focus({ preventScroll: true });
        }
        backdropProps?.onMouseDown?.(event);
    };

    // Focus is managed manually (see the open/close lifecycle effect) for Blueprint parity.
    const handleOpenAutoFocus = (event: Event) => {
        event.preventDefault();
    };
    const handleCloseAutoFocus = (event: Event) => {
        event.preventDefault();
        if (shouldReturnFocusOnClose) {
            const lastActive = lastActiveElementRef.current;
            if (lastActive && lastActive.isConnected && typeof lastActive.focus === "function") {
                lastActive.focus({ preventScroll: true });
            }
        }
    };

    const {
        ref: externalWrapperDivRef,
        className: _discardedWrapperDivClassName,
        ...wrapperDivRest
    } = wrapperDivProps ?? {};
    const containerRefCallback = React.useCallback(
        (node: HTMLDivElement | null) => {
            containerRef.current = node;
            if (typeof externalWrapperDivRef === "function") {
                externalWrapperDivRef(node);
            } else if (externalWrapperDivRef && typeof externalWrapperDivRef === "object") {
                (externalWrapperDivRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            }
        },
        [externalWrapperDivRef],
    );
    const wrapperRefCallback = React.useCallback((node: HTMLElement | null) => setWrapperElement(node), []);

    const focusableProps = modalFocusable
        ? {
              tabIndex: 0,
          }
        : undefined;

    const mergedBackdropProps: React.HTMLProps<HTMLDivElement> | undefined =
        !canOutsideClickClose && canEscapeKeyClose
            ? {
                  ...backdropProps,
                  // Escape key won't work anymore otherwise after clicking on the backdrop
                  tabIndex: 0,
              }
            : backdropProps;
    const {
        className: backdropPropsClassName,
        onMouseDown: _discardedBackdropMouseDown,
        ...backdropRest
    } = mergedBackdropProps ?? {};

    const dataState = isOpen ? "open" : "closed";

    const overlayRoot = (
        <div
            className={cn(
                "pointer-events-none absolute inset-0 overflow-auto",
                overlayClassName || undefined,
                preventReactFlowEvents ? preventReactFlowActionsClasses : undefined,
            )}
            ref={rootRef}
        >
            {effectiveHasBackdrop && (
                <div
                    {...backdropRest}
                    className={cn(
                        `${eccgui}-dialog__backdrop`,
                        "pointer-events-auto absolute inset-0 bg-black/50",
                        backdropClassName,
                        backdropPropsClassName,
                    )}
                    onMouseDown={handleBackdropMouseDown}
                />
            )}
            <div
                {...wrapperDivRest}
                className={cn(
                    `${eccgui}-dialog__container`,
                    "pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-auto outline-none",
                    // when the application header is elevated over modals (body gets
                    // `eccgui-application--topheader`), clear the 48px header rim (former dialog.scss rule);
                    // no left offset anymore — the shadcn sidebar shell has no fixed chrome rail below the header
                    "[.eccgui-application--topheader_&]:top-12 [.eccgui-application--topheader_&]:min-h-[calc(100%-48px)]",
                )}
                // this is a workaround because data attribute on SimpleDialog is not correctly routed to the overlay by blueprint js
                {...{ "data-test-id": dataTestId ?? "simpleDialogWidget", "data-testid": dataTestid }}
                {...focusableProps}
                tabIndex={0}
                ref={containerRefCallback}
            >
                <DialogPrimitive.Content
                    asChild
                    onEscapeKeyDown={handleEscapeKeyDown}
                    // all outside interactions (pointer + focus) are handled by the backdrop and
                    // document listeners above — never let Radix dismiss on its own
                    onInteractOutside={(event) => event.preventDefault()}
                    onOpenAutoFocus={handleOpenAutoFocus}
                    onCloseAutoFocus={handleCloseAutoFocus}
                    // Dialog content is arbitrary (frozen `Modal` API without title/description
                    // slots on this level), do not reference the non-existing Radix title and
                    // description elements.
                    aria-labelledby={undefined}
                    aria-describedby={undefined}
                >
                    <section
                        className={cn(
                            `${eccgui}-dialog__wrapper`,
                            typeof size === "string" ? `${eccgui}-dialog__wrapper--${size}` : undefined,
                            "pointer-events-auto select-text outline-none",
                            "m-8 flex max-h-[calc(100vh-4rem)] max-w-[calc(100vw-4rem)] content-stretch items-stretch justify-center",
                            // shrink to clear the elevated application header (former _header.scss rule)
                            "[.eccgui-application--topheader_&]:m-0 [.eccgui-application--topheader_&]:max-h-[calc(100vh-84px)] [.eccgui-application--topheader_&]:max-w-[calc(100vw-84px)]",
                            "[&>*]:max-w-full [&>*]:shrink [&>*]:grow",
                            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
                            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                            sizeClasses[size],
                            className || undefined,
                        )}
                        style={{ animationDuration: `${transitionDuration}ms` }}
                        ref={wrapperRefCallback}
                    >
                        <OverlayParentProvider parent={wrapperElement}>{alteredChildren}</OverlayParentProvider>
                    </section>
                </DialogPrimitive.Content>
            </div>
        </div>
    );

    if (!usePortal) {
        // Inline mode: rendered in place, positioned relative to the closest positioned ancestor.
        // No portal element exists in this mode (as before), close happens without exit transition.
        return (
            <DialogPrimitive.Root open={isOpen} modal={false}>
                {isOpen ? overlayRoot : null}
            </DialogPrimitive.Root>
        );
    }

    // Explicit fallback container: with an `undefined` container the Radix portal defers its
    // mount by one commit (SSR guard), which would make the container element unavailable to the
    // opening lifecycle effect on first render.
    const portalTarget =
        portalContainer ?? overlayParent ?? (typeof document !== "undefined" ? document.body : undefined);

    return (
        <DialogPrimitive.Root open={isOpen} modal={false}>
            <DialogPrimitive.Portal container={portalTarget}>
                <div
                    className={cn(
                        `${eccgui}-dialog__portal`,
                        "pointer-events-none fixed inset-0",
                        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
                        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
                        portalClassName || undefined,
                    )}
                    // z-index baseline via design token custom property; `forceTopPosition`
                    // recalculates this inline style value (see lifecycle effect above)
                    style={{ zIndex: "var(--eccgui-zindex-modals)", animationDuration: `${transitionDuration}ms` }}
                    data-state={dataState}
                    ref={portalRef}
                >
                    {overlayRoot}
                </div>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
};

export default Modal;
