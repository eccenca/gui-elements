import React from "react";
import ContextOverlay from "./ContextOverlay";
import Menu from "../Menu/Menu";
import IconButton from "../Icon/IconButton";

interface IContextMenuProps {
    children: any;
    /**
        space-delimited list of class names
    */
    className?: string;
    /**
        defines toggler elements that is used to open the context menu, could
        be any element or just a string for the icon name, default: "item-moremenu"
    */
    togglerElement?: JSX.Element | string;
    /**
        text that is used a tooltip to the toggler, default: "Show more options"
    */
    togglerText?: string;
}

function ContextMenu({
    children,
    className = "",
    togglerElement = "item-moremenu",
    togglerText = "Show more options",
}: IContextMenuProps) {
    return (
        <ContextOverlay className={"ecc-contextmenu " + className}>
            {typeof togglerElement === "string" ? (
                <IconButton name={togglerElement} text={togglerText} />
            ) : (
                { togglerElement }
            )}
            <Menu>{children}</Menu>
        </ContextOverlay>
    );
}

export default ContextMenu;
