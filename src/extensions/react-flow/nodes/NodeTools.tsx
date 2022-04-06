import React, {memo, useState} from "react";import {
    IPopoverProps as IBlueprintPopoverProps,
    PopoverInteractionKind as BlueprintPopoverInteractionKind,
} from "@blueprintjs/core";
import {ContextOverlay, IconButton} from "../../../../index";
import {CLASSPREFIX as eccgui} from "../../../configuration/constants";
import {ValidIconName} from "../../../components/Icon/canonicalIconNames";

export interface NodeToolsProps extends IBlueprintPopoverProps {
    children: string | JSX.Element;
    togglerElement?: ValidIconName | JSX.Element;
    togglerText?: string;
    menuButtonDataTestId?: string
}

export const NodeTools = memo(({
    children,
    togglerElement = "item-moremenu",
    togglerText = "Show more options",
    menuButtonDataTestId,
    ...otherOverlayProps
}: NodeToolsProps) => {
    const [isOpened, toggleIsOpened] = useState<boolean>(false);

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
