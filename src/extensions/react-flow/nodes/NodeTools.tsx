import React, { memo, useEffect, useState } from "react";

import { ValidIconName } from "@/components/atoms/Icon/canonicalIconNames";
import IconButton from "@/components/atoms/Icon/IconButton";
import ContextOverlay, { ContextOverlayProps } from "@/components/molecules/ContextOverlay/ContextOverlay";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

// Functions regarding the menu that can be called from the outside
export interface NodeToolsMenuFunctions {
    /** Closes the menu if its open. */
    closeMenu: () => void;
}

export interface NodeToolsProps extends Omit<ContextOverlayProps, "children"> {
    children: string | React.JSX.Element;
    togglerElement?: ValidIconName | React.JSX.Element;
    togglerText?: string;
    menuButtonDataTestId?: string;
    /** If defined this function will be called with the menu API object to be used externally. */
    menuFunctionsCallback?: (menuFunctions: NodeToolsMenuFunctions) => any;
}

export const NodeTools = memo(
    ({
        children,
        togglerElement = "item-moremenu",
        togglerText = "Show more options",
        menuButtonDataTestId,
        menuFunctionsCallback,
        ...otherOverlayProps
    }: NodeToolsProps) => {
        const [isOpen, setIsOpen] = useState<boolean>(false);

        useEffect(() => {
            menuFunctionsCallback &&
                menuFunctionsCallback({
                    closeMenu(): void {
                        setIsOpen(false);
                    },
                });
        }, [menuFunctionsCallback]);

        return (
            <ContextOverlay
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                hoverCloseDelay={500}
                interactionKind={isOpen ? "hover" : "click"}
                {...otherOverlayProps}
                content={<div className={`${eccgui}-graphviz__nodetools__content`}>{children}</div>}
            >
                {typeof togglerElement === "string" ? (
                    <IconButton
                        data-test-id={menuButtonDataTestId}
                        name={togglerElement}
                        text={togglerText}
                        // node headers are 30px tall: the default 36px icon button overflows them, and the
                        // ghost variant's solid accent hover reads broken on colored headers — use a compact
                        // box with a translucent hover that works on any header color
                        className="size-6 min-w-0 rounded-md hover:bg-foreground/10 hover:text-current"
                        onClick={() => setIsOpen((previous) => !previous)}
                    />
                ) : (
                    <>{togglerElement}</>
                )}
            </ContextOverlay>
        );
    },
);
