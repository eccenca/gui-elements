import React, { ReactElement } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { useOverlayParent } from "@/common/overlay/OverlayParentContext";
import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";
import { ValidIconName } from "@/components/atoms/Icon/canonicalIconNames";
import { IconButton, IconButtonProps } from "@/components/atoms/Icon/IconButton";
import { TestableComponent } from "@/components/interfaces";
import Menu from "@/components/molecules/Menu/Menu";
import { menuDropdownContentClassName, MenuModeProvider } from "@/components/molecules/Menu/MenuContext";

// Type-only import: keeps `contextOverlayProps` byte-compatible with every existing call site
// without pulling the (still Blueprint-based) `ContextOverlay` module into the runtime graph.
import type { ContextOverlayProps } from "./ContextOverlay";

export interface ContextMenuProps extends TestableComponent {
    /**
     * Addional CSS class names.
     */
    className?: string;
    /**
     * The elements of the context menu.
     * They will be wrapped in a `Menu` element automatically.
     */
    children?: React.JSX.Element | React.JSX.Element[];
    /**
     * Toggler that need to be used to display menu.
     * If a valid icon name is used then the icon element is displayed.
     * In this case `togglerText`, `togglerLarge` and `tooltipAsTitle` are used, too.
     */
    togglerElement?: ValidIconName | React.JSX.Element;
    /**
     * Text displayed as title or tooltip on toggler element.
     */
    togglerText?: string;
    /**
     * Allow to de- and increase the size of the default toggler button.
     */
    togglerSize?: IconButtonProps["size"];
    /**
     * Toggler element is displayed larger than normal.
     * @deprecated (v27) use `togglerSize="large" instead
     */
    togglerLarge?: boolean;
    /**
     * Tooltip on toggler element is display as HTML title, not as extra tooltip element.
     */
    tooltipAsTitle?: boolean;
    /**
     * Props to spread to `ContextOverlay` that is used to display the dropdown.
     * A pragmatic subset (`isOpen`/`defaultIsOpen`/`onInteraction`/`onClose`/`placement`) is mapped
     * onto the underlying Radix dropdown; the remaining Blueprint popover props are accepted for API
     * compatibility but no longer have an effect.
     */
    contextOverlayProps?: Partial<Omit<ContextOverlayProps, "content" | "children" | "className">>;
    /**
     * Disables the button to open the menu.
     */
    disabled?: boolean;
    /**
     * We use the target as placeholder before the real `<ContextMenu /` is rendered on first hover or focus event.
     * @deprecated (v27) no longer has an effect — the menu is rendered lazily by Radix.
     */
    preventPlaceholder?: boolean;
}

const alignSides = ["top", "right", "bottom", "left"] as const;
type RadixSide = (typeof alignSides)[number];

/** Map a Blueprint popover `placement` (e.g. `"bottom-start"`) to Radix `side`/`align`. */
const mapPlacement = (placement?: string): { side: RadixSide; align: "start" | "center" | "end" } => {
    if (!placement || placement === "auto") {
        return { side: "bottom", align: "start" };
    }
    const [rawSide, rawAlign] = placement.split("-");
    const side = (alignSides as readonly string[]).includes(rawSide) ? (rawSide as RadixSide) : "bottom";
    const align = rawAlign === "start" ? "start" : rawAlign === "end" ? "end" : "center";
    return { side, align };
};

/**
 * Element displays menu items after toggler is clicked.
 */
export const ContextMenu = ({
    children,
    className = "",
    togglerElement = "item-moremenu",
    togglerText = "Show more options",
    contextOverlayProps,
    disabled = false,
    togglerLarge = false,
    togglerSize,
    /* FIXME: The Tooltip component can interfere with the opened menu, since it is implemented via portal and may cover the menu,
              so by default we use the title attribute instead of Tooltip. */
    tooltipAsTitle = true,
    preventPlaceholder = false,
    "data-test-id": dataTestId,
    "data-testid": dataTestid,
}: ContextMenuProps) => {
    // `preventPlaceholder` no longer applies (Radix renders the content lazily itself); accepted for
    // API compatibility only.
    void preventPlaceholder;

    const overlayParent = useOverlayParent();

    const toggleButton =
        typeof togglerElement === "string" ? (
            <IconButton
                tooltipAsTitle={tooltipAsTitle}
                name={[togglerElement]}
                text={togglerText}
                size={togglerLarge ? "large" : togglerSize}
                disabled={disabled}
                data-test-id={dataTestId ?? undefined}
                data-testid={dataTestid ?? undefined}
            />
        ) : (
            (togglerElement as ReactElement)
        );

    const { side, align } = mapPlacement(contextOverlayProps?.placement as string | undefined);

    // Map the controlled/open lifecycle props from `contextOverlayProps` onto Radix.
    const controlledOpen = contextOverlayProps?.isOpen;
    const onInteraction = contextOverlayProps?.onInteraction as ((nextOpenState: boolean) => void) | undefined;
    const onClose = contextOverlayProps?.onClose as (() => void) | undefined;
    const onOpenChange =
        onInteraction || onClose
            ? (nextOpen: boolean) => {
                  onInteraction?.(nextOpen);
                  if (!nextOpen) {
                      onClose?.();
                  }
              }
            : undefined;

    return (
        <DropdownMenu.Root
            modal={false}
            open={controlledOpen}
            defaultOpen={contextOverlayProps?.defaultIsOpen}
            onOpenChange={onOpenChange}
        >
            <DropdownMenu.Trigger asChild disabled={disabled}>
                {toggleButton}
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal container={overlayParent}>
                <DropdownMenu.Content
                    className={cn(menuDropdownContentClassName, `${eccgui}-contextmenu`, className)}
                    style={{ zIndex: "var(--eccgui-zindex-overlays)" }}
                    side={side}
                    align={align}
                    sideOffset={4}
                    collisionPadding={8}
                >
                    <MenuModeProvider mode="dropdown">
                        <Menu>{children}</Menu>
                    </MenuModeProvider>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};

export default ContextMenu;
