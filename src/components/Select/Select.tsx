import React from "react";
import { Select2 as BlueprintSelect, Select2Props as BlueprintSelectProps } from "@blueprintjs/select";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { Button, ButtonProps, ContextOverlayProps } from "./../../index";

/**
 * FIXME: Currently we only route the original element through.
 * We should add here basic elements and processes for target and selections, etc.
 */

export interface SelectProps<T>
    extends Omit<BlueprintSelectProps<T>, "popoverTargetProps" | "popoverContentProps" | "popoverProps" | "popoverRef">,
        Pick<ButtonProps, "icon" | "rightIcon"> {
    /**
     * Textual representation of the the selected value.
     * This is displayed if the select target is not controlled directly via `children` elements.
     */
    text?: string;
    /**
     * Placeholder text displayed for selects without defined `text`.
     * This is displayed if the select target is not controlled directly via `children` elements.
     */
    placeholder?: string;
    /**
     * Props to spread to `ContextOverlay` that is used to display the dropdown.
     */
    contextOverlayProps?: Partial<
        Omit<ContextOverlayProps, "content" | "defaultIsOpen" | "disabled" | "fill" | "renderTarget" | "targetTagName">
    >;
}

/**
 * Create a Select box without the HTML select element.
 * It is possible to filter options, as well as to add new options if necessary.
 * Use this input element when the value is primarily selected from a defined set of elements.
 */
export function Select<T>({
    contextOverlayProps,
    className,
    children,
    text,
    placeholder = "Select item ...",
    icon,
    rightIcon,
    ...otherSelectProps
}: SelectProps<T>) {
    return (
        <BlueprintSelect<T>
            popoverProps={{
                minimal: true,
                matchTargetWidth: otherSelectProps.fill ?? false,
                ...contextOverlayProps,
            }}
            className={`${eccgui}-select` + (className ? ` ${className}` : "")}
            {...otherSelectProps}
        >
            {children ?? (
                <Button
                    text={text ?? placeholder}
                    alignText="left"
                    outlined
                    fill={otherSelectProps.fill ?? false}
                    disabled={otherSelectProps.disabled ?? false}
                    icon={icon}
                    rightIcon={rightIcon ?? "toggler-showmore"}
                />
            )}
        </BlueprintSelect>
    );
}

Select.ofType = BlueprintSelect.ofType; // FIXME: ofType returns the Blueprint Select2 element

export default Select;
