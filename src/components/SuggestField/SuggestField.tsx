import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { AutoCompleteField, AutoCompleteFieldProps } from "../AutocompleteField/AutoCompleteField";

export type SuggestFieldProps<T, UPDATE_VALUE> = AutoCompleteFieldProps<T, UPDATE_VALUE>;

/**
 * TODO: description.
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
