import { createNewItemRendererFactory } from "@/components/organisms/AutocompleteField/autoCompleteFieldUtils";

export * from "@/components/organisms/AutocompleteField/AutoCompleteField";
export * from "@/components/organisms/AutocompleteField/interfaces";

export const suggestFieldUtils = {
    createNewItemRendererFactory,
};

// @deprecated (v26) use `suggestFieldUtils`
export const autoCompleteFieldUtils = suggestFieldUtils;
