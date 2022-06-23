import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { TestableComponent } from "../interfaces";
import ContextOverlay, { ContextOverlayProps } from "./ContextOverlay";
import Menu from "../Menu/Menu";
import IconButton from "../Icon/IconButton";
import {ValidIconName} from "../Icon/canonicalIconNames";

interface ContextMenuProps extends ContextOverlayProps, TestableComponent {
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
}

/**
 * Element displays menu items after toggler is clicked.
 */
function ContextMenu({
    children,
    className = "",
    togglerElement = "item-moremenu",
    togglerText = "Show more options",
    togglerLarge = false,
    /* FIXME: The Tooltip component can interfere with the opened menu, since it is implemented via portal and may cover the menu,
              so by default we use the title attribute instead of Tooltip. */
    tooltipAsTitle = true,
    ...restProps
}: ContextMenuProps) {
    return (
        <ContextOverlay
            {...restProps}
            className={`${eccgui}-contextmenu ` + className}
            content={<Menu>{children}</Menu>}
        >
            {typeof togglerElement === "string" ? (
                <IconButton
                    tooltipAsTitle={tooltipAsTitle}
                    name={[togglerElement]}
                    text={togglerText}
                    large={togglerLarge}
                    data-test-id={restProps["data-test-id"]}
                />
            ) : (
                { togglerElement }
            )}
        </ContextOverlay>
    );
}

export default ContextMenu;
