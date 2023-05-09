import React, {ReactElement} from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { TestableComponent } from "../interfaces";
import ContextOverlay, { ContextOverlayProps } from "./ContextOverlay";
import Menu from "../Menu/Menu";
import IconButton from "../Icon/IconButton";
import {ValidIconName} from "../Icon/canonicalIconNames";

export interface ContextMenuProps extends TestableComponent {
    /**
     * Addional CSS class names.
     */
    className?: string;
    /**
     * The elements of the context menu.
     * They will be wrapped in a `Menu` element automatically.
     */
    children?: JSX.Element | JSX.Element[];
    /**
     * Toggler that need to be used to display menu.
     * If a valid icon name is used then the icon element is displayed.
     * In this case `togglerText`, `togglerLarge` and `tooltipAsTitle` are used, too.
     */
    togglerElement?: ValidIconName | JSX.Element;
    /**
     * Text displayed as title or tooltip on toggler element.
     */
    togglerText?: string;
    /**
     * Toggler element is displayed larger than normal.
     */
    togglerLarge?: boolean;
    /**
     * Tooltip on toggler element is display as HTML title, not as extra tooltip element.
     */
    tooltipAsTitle?: boolean;
    /**
     * Props to spread to `ContextOverlay` that is used to display the dropdown.
     */
    contextOverlayProps?: Partial<Omit<ContextOverlayProps, "content" | "children" | "className">>
    /** Disables the button to open the menu. */
    disabled?: boolean
}

/**
 * Element displays menu items after toggler is clicked.
 */
export const ContextMenu = ({
    children,
    className = "",
    togglerElement = "item-moremenu",
    togglerText = "Show more options",
    contextOverlayProps,
    disabled,
    togglerLarge = false,
    /* FIXME: The Tooltip component can interfere with the opened menu, since it is implemented via portal and may cover the menu,
              so by default we use the title attribute instead of Tooltip. */
    tooltipAsTitle = true,
    ...restProps
}: ContextMenuProps) => {
    return (
        <ContextOverlay
            {...restProps}
            {...contextOverlayProps}
            className={`${eccgui}-contextmenu ` + className}
            content={<Menu>{children}</Menu>}
        >
            {typeof togglerElement === "string" ? (
                <IconButton
                    tooltipAsTitle={tooltipAsTitle}
                    name={[togglerElement]}
                    text={togglerText}
                    large={togglerLarge}
                    disabled={!!disabled}
                    data-test-id={restProps["data-test-id"]}
                />
            ) : (
                togglerElement as ReactElement
            )}
        </ContextOverlay>
    );
}

export default ContextMenu;
