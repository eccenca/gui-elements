import React, {memo, useEffect, useState} from "react";
import {
    PopoverInteractionKind as BlueprintPopoverInteractionKind,
} from "@blueprintjs/core";
import { ContextOverlayProps } from "./../../../components/ContextOverlay/ContextOverlay";
import {ContextOverlay, IconButton} from "../../../index";
import {CLASSPREFIX as eccgui} from "../../../configuration/constants";
import {ValidIconName} from "../../../components/Icon/canonicalIconNames";

export interface NodeToolsProps extends ContextOverlayProps {
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
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        menuFunctionsCallback && menuFunctionsCallback({
            closeMenu(): void {
                setIsOpen(false)
            }
        })
    }, [menuFunctionsCallback])

    return (
        <ContextOverlay
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            hoverCloseDelay={500}
            interactionKind={isOpen ? BlueprintPopoverInteractionKind.HOVER : BlueprintPopoverInteractionKind.CLICK}
            {...otherOverlayProps}
            content={(
                <div className={`${eccgui}-graphviz__nodetools__content`}>
                    { children }
                </div>
            )}
        >
            {typeof togglerElement === "string" ? (
                <IconButton
                    data-test-id={menuButtonDataTestId}
                    name={togglerElement}
                    text={togglerText}
                    onClick={() => setIsOpen(previous => !previous)}
                />
            ) : (
                { togglerElement }
            )}
        </ContextOverlay>
    );
});
