import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import MultiSelect, { MultiSelectProps, MultiSelectSelectionProps } from "../MultiSelect/MultiSelect";

export type MultiSuggestFieldSelectionProps<T> = MultiSelectSelectionProps<T>;

export interface MultiSuggestFieldProps<T> extends Omit<MultiSelectProps<T>, "onSelection"> {
    /**
     *  function handler that would be called anytime an item is selected/deselected or an item is created/removed
     */
    onSelection?: (params: MultiSuggestFieldSelectionProps<T>) => void;
}

/**
 * Element behaves very similar to `SuggestField` but allows multiple selections.
 * Its value does not represent a string but a stack of objects.
 *
 * Example usage: input field for user created tags.
 */
export function MultiSuggestField<T>({ className, ...otherProps }: MultiSuggestFieldProps<T>) {
    // Currently this works only as an alias element for `MultiSelect`.
    return (
        <MultiSelect<T>
            className={`${eccgui}-multisuggestfield` + (className ? ` ${className}` : "")}
            {...(otherProps as MultiSelectProps<T>)}
        />
    );
}

// we still return the Blueprint element here because it was already used like that
/**
 * @deprecated (v25) use directly <MultiSelect<TYPE>> (`ofType` also returns the original BlueprintJS element, not ours!)
 */
MultiSuggestField.ofType = MultiSelect.ofType;
