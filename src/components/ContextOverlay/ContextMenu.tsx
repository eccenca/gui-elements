import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import ContextOverlay from "./ContextOverlay";
import Menu from "../Menu/Menu";
import IconButton from "../Icon/IconButton";

function ContextMenu({
    children,
    className = "",
    togglerElement = "item-moremenu",
    togglerText = "Show more options",
    togglerLarge = false,
    // The Tooltip component can interfere with the opened menu, since it is implemented via portal and may cover the menu,
                         // so by default we use the title attribute instead of Tooltip.
    tooltipAsTitle = true,
    ...restProps
}: any) {
    return (
        <ContextOverlay {...restProps} className={`${eccgui}-contextmenu ` + className}>
            {typeof togglerElement === "string" ? (
                <IconButton
                    tooltipAsTitle={tooltipAsTitle}
                    name={togglerElement}
                    text={togglerText}
                    large={togglerLarge}
                    data-test-id={restProps["data-test-id"]}
                />
            ) : (
                { togglerElement }
            )}
            <Menu>{children}</Menu>
        </ContextOverlay>
    );
}

export default ContextMenu;
