export interface IRenderModifiers {
    active: boolean
    disabled?: boolean
    // The width styles that should be given to the rendered option items
    styleWidth: IElementWidth
    highlightingEnabled: boolean
}

/** Style object to be used in menu option items. */
export interface IElementWidth {
    minWidth: string;
    //width: string
    maxWidth: string
}
