import React from "react";

import { cn } from "@/common/utils/cn";

/**
 * Chrome state handed to each card's {@link FloatingCardStackCard.render} function. It mirrors the
 * stack's internal state so the card can render its title bar / pin + collapse affordances.
 */
export interface FloatingCardStackRenderState {
    /** `true` only for the active card while the stack is expanded. */
    expanded: boolean;
    /** Whether the stack is pinned open (a pinned stack ignores click-outside / Escape). */
    pinned: boolean;
    /** Toggle the pinned state. */
    onTogglePin: () => void;
    /** Collapse the stack. */
    onCollapse: () => void;
}

export interface FloatingCardStackCard {
    /**
     * Stable identity. Each card stays mounted at this key across every expanded/collapsed/active
     * transition, so its React state (e.g. an in-flight request) survives switching cards.
     */
    key: string;
    /** Accessible label for the collapsed, peeking card's activation button, e.g. "Show Chat". */
    showLabel: string;
    /** Renders the card. Receives the chrome state (whether it is the active/expanded card etc.). */
    render: (state: FloatingCardStackRenderState) => React.ReactNode;
}

export interface FloatingCardStackProps {
    /**
     * The cards to stack, front-to-back in array order. The first card is active initially. The
     * stack keeps its own active-card selection afterwards; adding or reordering cards does not
     * steal focus. The one exception is removal: if the currently active card is no longer in the
     * list, the selection falls back to the first remaining card (otherwise no card would render
     * at the front layer).
     */
    cards: FloatingCardStackCard[];
    /**
     * Reports the collapsed stack's pixel height whenever it changes (and `0` while expanded), so
     * the surrounding layout can reserve space for the peeking cards.
     */
    onHeightChange?: (height: number) => void;
    /**
     * Tailwind height utility applied to the collapsed stack. A fixed collapsed height keeps the
     * stacked cards aligned; the back card peeks above the front via a small upward translate.
     *
     * @default "h-32"
     */
    collapsedHeightClassName?: string;
}

/**
 * A stack of floating cards anchored to the bottom of its (relatively positioned) container. One
 * card is active at a time; the others peek behind it. Clicking a card expands the stack to fill
 * the container; clicking outside or pressing Escape collapses it again (unless pinned).
 *
 * This component owns the layout, animation and interaction only — it is content-agnostic. Each
 * card supplies its own chrome and body via {@link FloatingCardStackCard.render}, which receives
 * the current chrome state.
 */
export function FloatingCardStack({
    cards,
    onHeightChange,
    collapsedHeightClassName = "h-32",
}: FloatingCardStackProps) {
    const [activeKey, setActiveKey] = React.useState<string | undefined>(cards[0]?.key);
    const [expanded, setExpanded] = React.useState(false);
    const [pinned, setPinned] = React.useState(false);
    const wrapperRef = React.useRef<HTMLDivElement | null>(null);

    // Reconcile the active card against changing membership. The consumer's card list can change
    // reactively (e.g. an AI card that appears/disappears with an `llmEnabled` flag). Preserve the
    // current selection whenever it still exists; only when the active card was removed (or none
    // was ever set) fall back to the first card, so a front card always renders. Returning the same
    // key is a no-op React bails on, so this never steals focus on unrelated membership changes.
    React.useEffect(() => {
        setActiveKey((prev) => (prev !== undefined && cards.some((c) => c.key === prev) ? prev : cards[0]?.key));
    }, [cards]);

    React.useEffect(() => {
        const el = wrapperRef.current;
        if (!el || !onHeightChange) return;
        if (expanded) {
            onHeightChange(0);
            return;
        }
        const report = () => onHeightChange(el.offsetHeight);
        report();
        const observer = new ResizeObserver(report);
        observer.observe(el);
        return () => observer.disconnect();
    }, [expanded, onHeightChange]);

    React.useEffect(() => {
        if (!expanded || pinned) return;
        const onPointerDown = (e: PointerEvent) => {
            if (!wrapperRef.current?.contains(e.target as Node)) setExpanded(false);
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setExpanded(false);
        };
        document.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [expanded, pinned]);

    const activate = (key: string) => {
        setActiveKey(key);
        setExpanded(true);
        setPinned(false);
        requestAnimationFrame(() => {
            wrapperRef.current?.querySelector("textarea")?.focus();
        });
    };
    const collapse = () => setExpanded(false);
    const togglePin = () => setPinned((p) => !p);

    // Both cards stay mounted at a stable `key={card.key}` position across every
    // expanded/collapsed/active transition; only the wrapping div's classes change. This preserves
    // each card's React state — critically any in-flight stream, which would otherwise be torn down
    // whenever collapsing (or expanding the other card) unmounted the subtree.
    return (
        <div
            ref={wrapperRef}
            className={cn(
                "group absolute inset-x-2 z-[45]",
                expanded ? "top-2 bottom-2" : cn("bottom-2", collapsedHeightClassName),
            )}
        >
            {cards.map((card) => {
                const isActive = card.key === activeKey;
                const content = card.render({
                    expanded: expanded && isActive,
                    pinned,
                    onTogglePin: togglePin,
                    onCollapse: collapse,
                });

                if (expanded) {
                    return (
                        <div key={card.key} className={cn("absolute inset-0", isActive ? "z-20" : "hidden")}>
                            {content}
                        </div>
                    );
                }
                if (isActive) {
                    return (
                        <div
                            key={card.key}
                            className="absolute inset-0 z-20 cursor-pointer transition-transform hover:-translate-y-0.5"
                            onClickCapture={() => activate(card.key)}
                        >
                            {content}
                        </div>
                    );
                }
                return (
                    <div
                        key={card.key}
                        className="absolute inset-0 z-10 -translate-y-2 scale-[0.985] cursor-pointer opacity-80 transition-all duration-300 ease-out group-hover:-translate-y-6 group-hover:opacity-100"
                        onClick={() => activate(card.key)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") activate(card.key);
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={card.showLabel}
                    >
                        {content}
                    </div>
                );
            })}
        </div>
    );
}

export default FloatingCardStack;
