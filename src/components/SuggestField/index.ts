import { createNewItemRendererFactory } from "./../AutocompleteField/autoCompleteFieldUtils";

export * from "./../AutocompleteField/AutoCompleteField";
export * from "./../AutocompleteField/interfaces";

export const suggestFieldUtils = {
    createNewItemRendererFactory,
};

// @deprecated (v26) use `suggestFieldUtils`
export const autoCompleteFieldUtils = suggestFieldUtils;
