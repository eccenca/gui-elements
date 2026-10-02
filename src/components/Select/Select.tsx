import React from "react";
import { Classes as BlueprintClasses, InputGroupProps } from "@blueprintjs/core";
import { Select as BlueprintSelect, SelectProps as BlueprintSelectProps } from "@blueprintjs/select";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { Button, ButtonProps } from "../Button/Button";
import { ContextOverlayProps } from "../ContextOverlay";
import Icon from "../Icon/Icon";
import { TestableComponent } from "../interfaces";
import OverflowText from "../Typography/OverflowText";

export interface SelectProps<T>
    extends
        TestableComponent,
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
    filterable = true,
    itemRenderer,
    onActiveItemChange,
    onClearanceText = "Reset selection",
    "data-test-id": dataTestId,
    "data-testid": dataTestid,
    wrapperProps,
    ...otherSelectProps
}: SelectProps<T>) {
    const comboboxRef = React.useRef<HTMLElement | null>(null);
    const blueprintSelectRef = React.useRef<BlueprintSelect<T> | null>(null);
    const tabDestinationRef = React.useRef<HTMLElement | null>(null);
    const tabPressedRef = React.useRef(false);
    const wrapperRef = React.useRef<HTMLDivElement | null>(null);
    const itemIds = React.useRef<Array<{ item: T; id: string }>>([]);

    React.useLayoutEffect(() => {
        if (!filterable) {
            // Blueprint overwrites popoverTargetProps.tabIndex, so set it on the rendered combobox.
            const combobox = wrapperRef.current?.querySelector<HTMLElement>(`.${eccgui}-select[role="combobox"]`);
            if (combobox) {
                combobox.tabIndex = otherSelectProps.disabled ? -1 : 0;
                comboboxRef.current = combobox;
            }
        }
    });

    const handleActiveItemChange: BlueprintSelectProps<T>["onActiveItemChange"] = (activeItem, isCreateNewItem) => {
        if (!filterable && comboboxRef.current) {
            const matchingItem = itemIds.current.find(({ item }) => {
                if (otherSelectProps.itemsEqual === undefined) {
                    return item === activeItem;
                }
                if (typeof otherSelectProps.itemsEqual === "function") {
                    return activeItem != null && otherSelectProps.itemsEqual(item, activeItem);
                }
                return (
                    activeItem != null && item[otherSelectProps.itemsEqual] === activeItem[otherSelectProps.itemsEqual]
                );
            });
            if (matchingItem && !isCreateNewItem) {
                comboboxRef.current.setAttribute("aria-activedescendant", matchingItem.id);
            } else {
                comboboxRef.current.removeAttribute("aria-activedescendant");
            }
        }
        onActiveItemChange?.(activeItem, isCreateNewItem);
    };

    const renderItem: BlueprintSelectProps<T>["itemRenderer"] = (item, props) => {
        if (props.id) {
            itemIds.current[props.index] = { item, id: props.id };
        }
        return itemRenderer(item, props);
    };

    const target = children ?? (
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
                        (rightIcon ?? <Icon name={"toggler-caretdown"} />)
                    )}
                </>
            }
            textClassName={text ? "" : BlueprintClasses.TEXT_MUTED}
            data-test-id={dataTestId ? dataTestId + "_toggler" : undefined}
            data-testid={dataTestid ? dataTestid + "_toggler" : undefined}
        />
    );

    const selectContent = (
        <BlueprintSelect<T>
            ref={blueprintSelectRef}
            filterable={filterable}
            itemRenderer={renderItem}
            onActiveItemChange={handleActiveItemChange}
            popoverTargetProps={
                filterable
                    ? undefined
                    : {
                          onFocusCapture: (event) => {
                              comboboxRef.current = event.currentTarget;
                              if (event.target !== event.currentTarget) {
                                  event.currentTarget.focus();
                              }
                          },
                          onKeyDownCapture: (event) => {
                              tabPressedRef.current = event.key === "Tab";
                          },
                          onBlur: (event) => {
                              if (tabPressedRef.current) {
                                  const tabDestination =
                                      event.relatedTarget instanceof HTMLElement ? event.relatedTarget : null;
                                  if (event.currentTarget.getAttribute("aria-expanded") === "true") {
                                      tabDestinationRef.current = tabDestination;
                                      // Blueprint leaves a select-only popover open when Tab moves focus away.
                                      blueprintSelectRef.current?.setState({ isOpen: false });
                                  } else if (tabDestination) {
                                      // Escape may still have a pending animation-frame focus restoration.
                                      requestAnimationFrame(() => {
                                          if (tabDestination.isConnected) {
                                              tabDestination.focus();
                                          }
                                      });
                                  }
                              }
                              tabPressedRef.current = false;
                          },
                      }
            }
            popoverProps={
                {
                    minimal: true,
                    matchTargetWidth: otherSelectProps.fill ?? false,
                    ...contextOverlayProps,
                    onOpening: (node) => {
                        if (!filterable) {
                            const activeOption = node.querySelector<HTMLElement>(
                                `.${BlueprintClasses.ACTIVE}[role="option"][id]`,
                            );
                            if (activeOption) {
                                comboboxRef.current?.setAttribute("aria-activedescendant", activeOption.id);
                            }
                        }
                        contextOverlayProps?.onOpening?.(node);
                    },
                    onClosing: (node) => {
                        if (!filterable) {
                            comboboxRef.current?.removeAttribute("aria-activedescendant");
                            const tabDestination = tabDestinationRef.current;
                            tabDestinationRef.current = null;
                            if (tabDestination) {
                                // Blueprint restores trigger focus in the same frame; let Tab keep its destination.
                                requestAnimationFrame(() => {
                                    if (tabDestination.isConnected) {
                                        tabDestination.focus();
                                    }
                                });
                            }
                        }
                        contextOverlayProps?.onClosing?.(node);
                    },
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
            {!filterable && React.isValidElement<{ tabIndex?: number }>(target)
                ? React.cloneElement(target, { tabIndex: -1 })
                : target}
        </BlueprintSelect>
    );

    return !filterable || wrapperProps || dataTestId || dataTestid ? (
        <div
            ref={wrapperRef}
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

export default Select;
