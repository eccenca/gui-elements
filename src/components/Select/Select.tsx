import React from "react";
import {
    Select2 as BlueprintSelect,
    Select2Props as BlueprintSelectProps,
} from "@blueprintjs/select";
import { ContextOverlayProps } from "./../../index";

/**
 * FIXME: Currently we only route the original element through.
 * We should add here basic elemeents and processes for target and selections, etc.
 */

export interface SelectProps<T> extends Omit<
    BlueprintSelectProps<T>,
    "popoverTargetProps" | "popoverContentProps" | "popoverProps" | "popoverRef"
> {
    /**
     * Props to spread to `ContextOverlay` that is used to display the dropdown.
     */
    contextOverlayProps?: Partial<Omit<ContextOverlayProps, "content" | "defaultIsOpen" | "disabled" | "fill" | "renderTarget" | "targetTagName">>
}

/**
 * Create a Select box without the HTML select element.
 * It is possible to filter options, as well as to add new options if necessary.
 */
export function Select<T>({contextOverlayProps, ...otherSelectProps}: SelectProps<T>) {
    return (
        <BlueprintSelect<T>
            popoverProps={{ minimal: true, ...contextOverlayProps}}
            {...otherSelectProps}
        />
    );
}

// Select.ofType = BlueprintSelect.ofType; // ofType seems not necessary anymore

export default Select;
