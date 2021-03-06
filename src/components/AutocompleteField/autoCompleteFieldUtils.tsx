import {MenuItem, OverflowText} from "@gui-elements/index";
import React from "react";
import {IElementWidth, IRenderModifiers} from "@gui-elements/src/components/AutocompleteField/AutoCompleteField";

/** Returns a function to be used in an AutoComplete widget for rendering custom elements based on the query string.
 *
 * @param itemTextRenderer The text or element that should be displayed for the new custom item suggestion.
 * @param iconName Optional icon to show left to the text.
 */
export const createNewItemRendererFactory = (
    itemTextRenderer: (query: string, styleWidth: IElementWidth) => string | JSX.Element,
    iconName?: string) => {
    // Return custom render function
    return (query: string, modifiers: IRenderModifiers, handleClick: React.MouseEventHandler<HTMLElement>) => {
        let textElement = itemTextRenderer(query, modifiers.styleWidth)
        if(typeof textElement === "string") {
            textElement = <OverflowText style={modifiers.styleWidth}>
                {`Create option '${query}'`}
            </OverflowText>
        }
        return (
            <MenuItem
                icon={iconName}
                active={modifiers.active}
                key={query}
                onClick={handleClick}
                text={textElement}
            />
        );
    };
};
