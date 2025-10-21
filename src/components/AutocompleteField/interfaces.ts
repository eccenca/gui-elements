export interface SuggestFieldItemRendererModifierProps {
    active: boolean;
    disabled?: boolean;
    // The width styles that should be given to the rendered option items
    styleWidth?: IElementWidth;
    highlightingEnabled: boolean;
}

interface IElementWidth {
    minWidth: string;
    maxWidth: string;
}
