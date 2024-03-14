import React from "react";
import { Classes as BlueprintClasses, InputGroupProps } from "@blueprintjs/core";
import { Select as BlueprintSelect, SelectProps as BlueprintSelectProps } from "@blueprintjs/select";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { TestableComponent } from "../interfaces";

import { Button, ButtonProps, ContextOverlayProps, Icon, OverflowText } from "./../../index";

export interface SelectProps<T>
    extends TestableComponent,
        Omit<BlueprintSelectProps<T>, "popoverTargetProps" | "popoverContentProps" | "popoverProps" | "popoverRef">,
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
    /**
     * If set then a `div` element is used as wrapper.
     * It uses the attributes given via this property.
     */
    wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
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
    "data-test-id": dataTestId,
    "data-testid": dataTestid,
    wrapperProps,
    ...otherSelectProps
}: SelectProps<T>) {
    const selectContent = (
        <BlueprintSelect<T>
            popoverProps={
                {
                    minimal: true,
                    matchTargetWidth: otherSelectProps.fill ?? false,
                    ...contextOverlayProps,
                } as ContextOverlayProps
            }
            popoverContentProps={
                {
                    "data-test-id": dataTestId ? dataTestId + "_drowpdown" : undefined,
                    "data-testid": dataTestid ? dataTestid + "_dropdown" : undefined,
                } as BlueprintSelectProps<T>["popoverContentProps"]
            }
            inputProps={
                {
                    round: true,
                    fill: otherSelectProps.fill,
                    "data-test-id": dataTestId ? dataTestId + "_searchinput" : undefined,
                    "data-testid": dataTestid ? dataTestid + "_searchinput" : undefined,
                    ...inputProps,
                } as InputGroupProps
            }
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
                    textClassName={text ? "" : BlueprintClasses.TEXT_MUTED}
                    data-test-id={dataTestId + "_togger"}
                    data-testid={dataTestid + "_togger"}
                />
            )}
        </BlueprintSelect>
    );

    return wrapperProps || dataTestId || dataTestid ? (
        <div
            className={`${eccgui}-select__wrapper`}
            {...(wrapperProps ?? {})}
            {...{ "data-test-id": dataTestId, "data-testid": dataTestid }}
        >
            {selectContent}
        </div>
    ) : (
        <>{selectContent}</>
    );
}

/** @deprecated: instead of `const MySelect = Select.ofType<MyType>()` use directly `<Select<MyType> {...props} />` */
function ofType<U>() {
    console.warn(
        "Usage of `ofType()` is deprecated! Instead of `const MySelect = Select.ofType<MyType>()` use directly `<Select<MyType> {...props} />`"
    );
    return (props: SelectProps<U>) => <Select<U> {...props} />;
}

Select.ofType = ofType;

export default Select;
