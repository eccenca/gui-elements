import { createNewItemRendererFactory } from "./autoCompleteFieldUtils";

export * from "./SuggestField";
export * from "./interfaces";

export const suggestFieldUtils = {
    createNewItemRendererFactory,
};

// @deprecated (v26) use `suggestFieldUtils`
export const autoCompleteFieldUtils = suggestFieldUtils;
