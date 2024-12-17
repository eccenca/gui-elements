import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import AutoSuggestion, { AutoSuggestionProps } from "../AutoSuggestion/AutoSuggestion";

export interface CodeAutocompleteFieldProps extends AutoSuggestionProps {}

/**
 * Input component that allows partial, fine-grained auto-completion, i.e. of sub-strings of the input string.
 * This is comparable to a one line code editor.
 *
 * Example usage: input of a path string offering auto-completion for each single part of the path.
 */
export function CodeAutocompleteField({ className, ...otherProps }: CodeAutocompleteFieldProps) {
    // Currently this works only as an alias element for `AutoSuggestion`.
    return (
        <AutoSuggestion
            className={`${eccgui}-codeautocompletefield` + (className ? ` ${className}` : "")}
            {...otherProps}
        />
    );
}
