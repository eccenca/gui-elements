import React, {memo, useEffect, useState} from "react";import {
    IPopoverProps as IBlueprintPopoverProps,
    PopoverInteractionKind as BlueprintPopoverInteractionKind,
} from "@blueprintjs/core";
import {ContextOverlay, IconButton} from "../../../index";
import {CLASSPREFIX as eccgui} from "../../../configuration/constants";
import {ValidIconName} from "../../../components/Icon/canonicalIconNames";

export interface NodeToolsProps extends IBlueprintPopoverProps {
    children: string | JSX.Element;
    togglerElement?: ValidIconName | JSX.Element;
    togglerText?: string;
    menuButtonDataTestId?: string
    /** If defined this function will be called with the menu API object to be used externally. */
    menuFunctionsCallback?: (menuFunctions: NodeToolsMenuFunctions) => any
}

// Functions regarding the menu that can be called from the outside
export interface NodeToolsMenuFunctions {
    /** Closes the menu if its open. */
    closeMenu: () => void
}

export const NodeTools = memo(({
    children,
    togglerElement = "item-moremenu",
    togglerText = "Show more options",
    menuButtonDataTestId,
    menuFunctionsCallback,
    ...otherOverlayProps
}: NodeToolsProps) => {
    const [isOpened, toggleIsOpened] = useState<boolean>(false);

    useEffect(() => {
        menuFunctionsCallback && menuFunctionsCallback({
            closeMenu(): void {
                toggleIsOpened(false)
            }
        })
    }, [menuFunctionsCallback])

    return (
        <ContextOverlay
            defaultIsOpen={isOpened}
            interactionKind={isOpened ? BlueprintPopoverInteractionKind.HOVER : BlueprintPopoverInteractionKind.CLICK}
            onOpening={() => { toggleIsOpened(true); }}
            onClosing={() => { toggleIsOpened(false); }}
            {...otherOverlayProps}
        >
            {typeof togglerElement === "string" ? (
                <IconButton
                    data-test-id={menuButtonDataTestId}
                    name={togglerElement}
                    text={togglerText}
                    onMouseUp={() => {
                        if (isOpened) { toggleIsOpened(false) };
                    }}/>
            ) : (
                { togglerElement }
            )}
            <div className={`${eccgui}-graphviz__nodetools__content`}>
                { children }
            </div>
        </ContextOverlay>
    );
});
