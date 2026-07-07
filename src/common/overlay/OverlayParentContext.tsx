import React from "react";

/**
 * Context carrying the DOM element that stacked overlays (portals) should render into.
 *
 * Purpose: mixed overlay stacks during the Blueprint/Radix transition. A modal (e.g. the
 * gui-elements `Modal`, later the Radix dialog) provides its container element via
 * `OverlayParentProvider`; every overlay opened from inside it — Radix portals
 * (dropdown menu, tooltip, popover, dialog) as well as remaining Blueprint portals —
 * consumes the value and portals into that container instead of `document.body`.
 * This keeps focus traps, dismiss layers, and z-index stacking coherent.
 *
 * `undefined` means "no overlay parent": portal into the default target (`document.body`).
 */
export const OverlayParentContext = React.createContext<HTMLElement | undefined>(undefined);

/**
 * Returns the current overlay container element, or `undefined` if the component is not
 * rendered inside an overlay that provides one. Pass the result to portal `container`
 * props (Radix `Portal container={...}`) or Blueprint `portalContainer`.
 */
export const useOverlayParent = (): HTMLElement | undefined => React.useContext(OverlayParentContext);

export interface OverlayParentProviderProps {
    /**
     * The element nested overlays should portal into.
     * `null`/`undefined` values are normalized to `undefined` (= default portal target).
     */
    parent?: HTMLElement | null;
    children?: React.ReactNode;
}

/**
 * Provides the overlay container for all nested overlays.
 * Typically rendered by modal/dialog implementations with their own content element.
 */
export const OverlayParentProvider = ({ parent, children }: OverlayParentProviderProps) => {
    return <OverlayParentContext.Provider value={parent ?? undefined}>{children}</OverlayParentContext.Provider>;
};
