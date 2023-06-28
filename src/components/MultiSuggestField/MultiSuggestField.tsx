import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { MultiSelect, MultiSelectProps } from "../MultiSelect/MultiSelect";

export type MultiSuggestFieldProps<T> = MultiSelectProps<T>;

/**
 * Element behaves very similar to `SuggestField` but allows multiple selections.
 * Its value does not represent a string but a stack of objects.
 *
 * Example usage: input field for user created tags.
 */
export function MultiSuggestField<T>({ className, ...otherProps }: MultiSuggestFieldProps<T>) {
    // Currently this works only as an alias element for `MultiSelect`.
    return <MultiSelect<T> className={`${eccgui}-multisuggest` + (className ? ` ${className}` : "")} {...otherProps} />;
}
