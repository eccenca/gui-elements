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
    ...restProps
}: any) {
    return (
        <ContextOverlay {...restProps} className={`${eccgui}-contextmenu ` + className}>
            {typeof togglerElement === "string" ? (
                <IconButton name={togglerElement} text={togglerText} large={togglerLarge} />
            ) : (
                { togglerElement }
            )}
            <Menu>{children}</Menu>
        </ContextOverlay>
    );
}

export default ContextMenu;
