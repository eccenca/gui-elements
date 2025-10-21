import React from "react";

import { ValidIconName } from "../Icon/canonicalIconNames";
import MenuItem from "../Menu/MenuItem";
import OverflowText from "../Typography/OverflowText";

import { TestIconProps } from "./../Icon/TestIcon";
import { SuggestFieldItemRendererModifierProps } from "./interfaces";

/**
 * Returns a function to be used in an AutoComplete widget for rendering custom elements based on the query string.
 *
 * @param itemTextRenderer The text or element that should be displayed for the new custom item suggestion.
 * @param iconName Optional icon to show left to the text.
 */
export const createNewItemRendererFactory = (
    itemTextRenderer: (query: string) => string | JSX.Element,
    iconName?: ValidIconName | React.ReactElement<TestIconProps>
) => {
    // Return custom render function
    return (query: string, modifiers: SuggestFieldItemRendererModifierProps, handleClick: React.MouseEventHandler<HTMLElement>) => {
        let textElement = itemTextRenderer(query);
        if (typeof textElement === "string") {
            textElement = (
                <OverflowText>{textElement.trim() !== "" ? textElement : `Create option '${query}'`}</OverflowText>
            );
        }
        return (
            <MenuItem icon={iconName} active={modifiers.active} key={query} onClick={handleClick} text={textElement} />
        );
    };
};
