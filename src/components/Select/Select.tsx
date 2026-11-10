import React from "react";
import { Classes as BlueprintClasses, InputGroupProps } from "@blueprintjs/core";
import { executeItemsEqual, Select as BlueprintSelect, SelectProps as BlueprintSelectProps } from "@blueprintjs/select";

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
            const matchingItem = itemIds.current.find(({ item }) =>
                executeItemsEqual(otherSelectProps.itemsEqual, item, activeItem),
            );
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

    const handleClear = (event: React.SyntheticEvent<Element>) => {
        event.stopPropagation();
        if (otherSelectProps.disabled) {
            return;
        }
        const trigger = event.currentTarget.closest("button");
        onClearanceHandler?.();
        if (filterable) {
            trigger?.focus();
        } else {
            comboboxRef.current?.focus();
        }
    };

    const handleClearKeyDown: React.KeyboardEventHandler = (event) => {
        event.stopPropagation();
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
        }
    };

    const handleClearKeyUp: React.KeyboardEventHandler = (event) => {
        event.stopPropagation();
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            // Return focus after key release so the trigger cannot activate with the same key.
            handleClear(event);
        }
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
                        <span
                            tabIndex={!onClearanceText ? (otherSelectProps.disabled ? -1 : 0) : undefined}
                            onClick={handleClear}
                            onKeyDown={handleClearKeyDown}
                            onKeyUp={handleClearKeyUp}
                        >
                            <Icon
                                name="operation-clear"
                                tooltipText={onClearanceText ? onClearanceText : undefined}
                                tooltipProps={{
                                    disabled: otherSelectProps.disabled,
                                    // Prevent placeholder swaps from restoring stale focus.
                                    usePlaceholder: false,
                                }}
                            />
                        </span>
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
                              if (
                                  event.target !== event.currentTarget &&
                                  event.target instanceof Element &&
                                  event.target.matches('[tabindex="-1"]')
                              ) {
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
                                      const trigger = event.currentTarget;
                                      // Escape may still have a pending animation-frame focus restoration.
                                      requestAnimationFrame(() => {
                                          const active = document.activeElement;
                                          // Only undo a focus restoration, never a later focus change by the user.
                                          if (
                                              tabDestination.isConnected &&
                                              (active === trigger || active === document.body || active === null)
                                          ) {
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
                        if (filterable) {
                            // Blueprint puts aria-controls on the trigger, but focus moves to the search combobox.
                            const input = node.querySelector<HTMLInputElement>('input[role="combobox"]');
                            const listbox = node.querySelector<HTMLElement>('[role="listbox"][id]');
                            if (input && listbox && !input.hasAttribute("aria-controls")) {
                                input.setAttribute("aria-controls", listbox.id);
                            }
                        } else {
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

    const inlineWrapper = !otherSelectProps.fill ? { display: "inline-block" } : {};

    return !filterable || wrapperProps || dataTestId || dataTestid ? (
        <div
            ref={wrapperRef}
            className={`${eccgui}-select__wrapper`}
            {...(wrapperProps ?? {})}
            style={{ ...wrapperProps?.style, ...inlineWrapper }}
            {...{ "data-test-id": dataTestId, "data-testid": dataTestid }}
        >
            {selectContent}
        </div>
    ) : (
        <>{selectContent}</>
    );
}

export default Select;
