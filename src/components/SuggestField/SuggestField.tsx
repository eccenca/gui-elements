import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { AutoCompleteField, AutoCompleteFieldProps } from "../AutocompleteField/AutoCompleteField";

export type SuggestFieldProps<T, UPDATE_VALUE> = AutoCompleteFieldProps<T, UPDATE_VALUE>;

/**
 * A component with the appearance of an input field that allows to select and optionally create new items.
 * It shows suggestions for the entered text from which the user can select any option.
 * It has the following fixed behavior:
 *
 * - When not focused, a different representation of the item value can be shown, e.g. the label of the value.
 * - When changing an existing item the input text is set to the original value in order to be able to edit the original value.
 * - When for a specific input text, the only item returns is the currently set item itself, all items are shown below it, to make
 *   clear that there are still other items to choose from.
 * - The suggestions are fetched with a short delay, so not too many unnecessary requests are fired.
 * - Items where itemRenderer returns a string have a default representation, i.e. highlighting of search words, active flag etc.
 */
export function SuggestField<T, UPDATE_VALUE>({ className, ...otherProps }: SuggestFieldProps<T, UPDATE_VALUE>) {
    // Currently this works only as an alias element for `AutoCompleteField`.
    return (
        <AutoCompleteField<T, UPDATE_VALUE>
            className={`${eccgui}-suggestfield` + (className ? ` ${className}` : "")}
            {...otherProps}
        />
    );
}
