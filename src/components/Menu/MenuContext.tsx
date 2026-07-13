import React from "react";

/**
 * How the `Menu` family renders its items.
 *
 * - `"dropdown"`: the menu is the content of a Radix `DropdownMenu` (e.g. `ContextMenu`, or a
 *   `Menu` used as dropdown content). `MenuItem`s render as Radix dropdown-menu items and therefore
 *   inherit Radix keyboard navigation, typeahead and roving focus.
 * - `"static"` (default): the menu is a plain, styled listbox/menu, e.g. when `MenuItem`s are reused
 *   as item renderers inside `SuggestField`/`Select` popovers. In this mode the *parent* component
 *   (Blueprint `Select`/`Suggest`, `AutoSuggestionList`, …) owns keyboard navigation and highlights
 *   the current entry via the `active` prop.
 *
 * `MenuModeProvider` is re-exported from the `Menu` barrel so applications can host a `Menu` inside
 * their own Radix dropdown surfaces (e.g. the workbench user menu inside a `shadcn.DropdownMenu`);
 * the remaining internals (`MenuModeContext`, `useMenuMode`) stay private to `Menu`, `MenuItem`
 * and `ContextMenu`.
 */
export type MenuMode = "dropdown" | "static";

export const MenuModeContext = React.createContext<MenuMode>("static");

/** Current menu render mode, defaults to `"static"` outside of any dropdown. */
export const useMenuMode = (): MenuMode => React.useContext(MenuModeContext);

export interface MenuModeProviderProps {
    mode: MenuMode;
    children?: React.ReactNode;
}

/** Provides the {@link MenuMode} to nested `Menu`/`MenuItem` elements. */
export const MenuModeProvider = ({ mode, children }: MenuModeProviderProps) => (
    <MenuModeContext.Provider value={mode}>{children}</MenuModeContext.Provider>
);

/**
 * shadcn/ui `dropdown-menu` content recipe (new-york-v4), shared by the `ContextMenu` content and by
 * `MenuItem` submenu (`SubContent`) surfaces so both look identical. Kept in sync with
 * `src/_shadcn/ui/dropdown-menu.tsx`. Colours resolve against the Tailwind theme tokens
 * (`bg-popover`, `text-popover-foreground`, `border-border`).
 */
export const menuDropdownContentClassName =
    "min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md " +
    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 " +
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 " +
    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 " +
    "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2";
