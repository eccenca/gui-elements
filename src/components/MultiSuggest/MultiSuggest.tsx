import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { MultiSelect, MultiSelectProps } from "../MultiSelect/MultiSelect";

export type MultiSuggestProps<T> = MultiSelectProps<T>;

/**
 * Description.
 */
export function MultiSuggest<T>({ className, ...otherProps }: MultiSuggestProps<T>) {
    // Currently this works only as an alias element for `MultiSelect`.
    return <MultiSelect<T> className={`${eccgui}-multisuggest` + (className ? ` ${className}` : "")} {...otherProps} />;
}
