export interface SuggestFieldItemRendererModifierProps {
    active: boolean;
    disabled?: boolean;
    // The width styles that should be given to the rendered option items
    styleWidth?: IElementWidth;
    highlightingEnabled: boolean;
}

/** @deprecated (v25) use `SuggestFieldItemRendererModifierProps` */
export type IRenderModifiers = SuggestFieldItemRendererModifierProps;

/** @deprecated (v25) use `SuggestFieldItemRendererModifierProps["styleWidth"]` */
export interface IElementWidth {
    minWidth: string;
    maxWidth: string;
}
