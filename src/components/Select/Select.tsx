import React from "react";
import { Select2 as BlueprintSelect, Select2Props as BlueprintSelectProps } from "@blueprintjs/select";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { Button, ButtonProps, ContextOverlayProps, Icon, OverflowText } from "./../../index";

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
    /**
     * Event handler to reset search input.
     * Only works with the uncontrolled default select target.
     * If set then `rightElement` is automatically set with an action button to trigger the handler.
     */
    onClearanceHandler?: () => void;
    /**
     * Tooltip to show for the clear button.
     * Only works with the uncontrolled default select target.
     */
    onClearanceText?: string;
}

/**
 * Create a Select box without the HTML select element.
 * It is possible to filter options, as well as to add new options if necessary.
 *
 * **Use this input element when the value is primarily selected from a defined set of elements.**
 */
export function Select<T>({
    contextOverlayProps,
    className,
    children,
    text,
    placeholder = "Select item ...",
    icon,
    rightIcon,
    onClearanceHandler,
    inputProps,
    onClearanceText = "Reset selection",
    ...otherSelectProps
}: SelectProps<T>) {
    return (
        <BlueprintSelect<T>
            popoverProps={{
                minimal: true,
                matchTargetWidth: otherSelectProps.fill ?? false,
                ...contextOverlayProps,
            }}
            inputProps={{
                round: true,
                ...inputProps,
            }}
            className={`${eccgui}-select` + (className ? ` ${className}` : "")}
            {...otherSelectProps}
        >
            {children ?? (
                <Button
                    text={text ? <OverflowText>{text}</OverflowText> : <OverflowText>{placeholder}</OverflowText>}
                    alignText="left"
                    outlined
                    fill={otherSelectProps.fill ?? false}
                    disabled={otherSelectProps.disabled ?? false}
                    icon={icon}
                    rightIcon={
                        <>
                            {onClearanceHandler && text && (
                                <Icon
                                    name="operation-clear"
                                    tooltipText={onClearanceText ? onClearanceText : undefined}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onClearanceHandler();
                                    }}
                                />
                            )}
                            {typeof rightIcon === "string" ? (
                                <Icon name={rightIcon} />
                            ) : (
                                rightIcon ?? <Icon name={"toggler-caretdown"} />
                            )}
                        </>
                    }
                />
            )}
        </BlueprintSelect>
    );
}

Select.ofType = BlueprintSelect.ofType; // FIXME: ofType returns the Blueprint Select2 element

export default Select;
