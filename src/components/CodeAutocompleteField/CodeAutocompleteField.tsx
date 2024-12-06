import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import AutoSuggestion, { AutoSuggestionProps } from "../AutoSuggestion/AutoSuggestion";
import Spinner from "../Spinner/Spinner";

export interface CodeAutocompleteFieldProps extends AutoSuggestionProps {
    /** If the component should re-init when the initial value changes. Used when a value should be set externally.*/
    reInitOnInitialValueChange?: boolean
}

/**
 * Input component that allows partial, fine-grained auto-completion, i.e. of sub-strings of the input string.
 * This is comparable to a one line code editor.
 *
 * Example usage: input of a path string offering auto-completion for each single part of the path.
 */
export function CodeAutocompleteField({ className, reInitOnInitialValueChange = false, ...otherProps }: CodeAutocompleteFieldProps) {
    const [reInit, setReInit] = React.useState<boolean>(false)

    React.useEffect(() => {
        if(reInitOnInitialValueChange) {
            setReInit(true)
        }
    }, [otherProps.initialValue, reInitOnInitialValueChange])

    React.useEffect(() => {
        if(reInit) {
            setReInit(false)
        }
    }, [reInit])

    // Currently this works only as an alias element for `AutoSuggestion`.
    return reInit ?
        <Spinner size="tiny" position="inline" description="Validating value path"/> :
        <AutoSuggestion
            className={`${eccgui}-codeautocompletefield` + (className ? ` ${className}` : "")}
            {...otherProps}
        />
}
