import React from "react";
import { Classes as BlueprintClasses, InputGroupProps } from "@blueprintjs/core";
import { executeItemsEqual, Select as BlueprintSelect, SelectProps as BlueprintSelectProps } from "@blueprintjs/select";
import classNames from "classnames";

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
     * Set your i18n label, otherwise it falls back to "Reset selection".
     */
    onClearanceText?: string;
    /**
     * If set then a `div` element is used as wrapper.
     * It uses the attributes given via this property.
     */
    wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
}

/**
 * Elements inside custom `children` of a non-filterable Select that need to be removed from the Tab order.
 */
const focusableSelectors = "a[href], button, input, select, textarea, summary, [tabindex], [contenteditable=true]";

const restoreAttribute = (element: HTMLElement, attribute: string, value: string | null) => {
    if (value === null) {
        element.removeAttribute(attribute);
    } else {
        element.setAttribute(attribute, value);
    }
};

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
    /** focusable elements of custom `children` that were hidden inside the combobox, with their original attributes */
    const hiddenTargetElements = React.useRef(
        new Map<HTMLElement, { tabIndex: string | null; ariaHidden: string | null }>(),
    );

    React.useLayoutEffect(() => {
        let focusableChildren: HTMLElement[] = [];
        if (!filterable) {
            // Blueprint overwrites popoverTargetProps.tabIndex, so set it on the rendered combobox.
            const combobox = wrapperRef.current?.querySelector<HTMLElement>(`.${eccgui}-select[role="combobox"]`);
            if (combobox) {
                combobox.tabIndex = otherSelectProps.disabled ? -1 : 0;
                comboboxRef.current = combobox;
                if (children) {
                    // The combobox is the only interactive element, custom targets can only be presentational.
                    focusableChildren = Array.from(combobox.querySelectorAll<HTMLElement>(focusableSelectors));
                }
            }
        }
        const hiddenElements = hiddenTargetElements.current;
        hiddenElements.forEach((original, element) => {
            if (!focusableChildren.includes(element)) {
                restoreAttribute(element, "tabindex", original.tabIndex);
                restoreAttribute(element, "aria-hidden", original.ariaHidden);
                hiddenElements.delete(element);
            }
        });
        focusableChildren.forEach((element) => {
            if (!hiddenElements.has(element)) {
                hiddenElements.set(element, {
                    tabIndex: element.getAttribute("tabindex"),
                    ariaHidden: element.getAttribute("aria-hidden"),
                });
            }
            element.setAttribute("tabindex", "-1");
            element.setAttribute("aria-hidden", "true");
        });
    });

    /**
     * Move focus to the Tab destination after Blueprint restored it to the combobox in the next animation frame.
     * If focus was moved again in the meantime, e.g. by a further Tab, that newer destination is used instead.
     */
    const keepTabDestination = (tabDestination: HTMLElement) => {
        let destination = tabDestination;
        const trackFocus = (event: FocusEvent) => {
            if (event.target instanceof HTMLElement && event.target !== comboboxRef.current) {
                destination = event.target;
            }
        };
        document.addEventListener("focusin", trackFocus);
        // Registered after Blueprint's focus restoration, so it runs after it within the same frame.
        requestAnimationFrame(() => {
            document.removeEventListener("focusin", trackFocus);
            const active = document.activeElement;
            if (
                destination.isConnected &&
                destination !== active &&
                (active === comboboxRef.current || active === document.body || active === null)
            ) {
                destination.focus();
            }
        });
    };

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

    const handleEnterSpaceUsage = (event: React.KeyboardEvent<Element>, triggerClearance: boolean) => {
        event.stopPropagation();
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();

            if (triggerClearance) {
                handleClear(event);
            }
        }
    };

    const clearAction = onClearanceHandler && text && (
        <span
            title={onClearanceText ? onClearanceText : undefined}
            aria-label={onClearanceText ? onClearanceText : undefined}
            role={"button"}
            tabIndex={otherSelectProps.disabled ? -1 : 0}
            aria-hidden={!onClearanceText || undefined}
            aria-disabled={otherSelectProps.disabled || undefined}
            onClick={handleClear}
            onKeyDown={(e) => handleEnterSpaceUsage(e, false)}
            onKeyUp={(e) => handleEnterSpaceUsage(e, true)}
        >
            <Icon name="operation-clear" />
        </span>
    );
    const defaultRightIcon = (
        <>
            {clearAction}
            {typeof rightIcon === "string" ? (
                <Icon name={rightIcon} />
            ) : (
                (rightIcon ?? <Icon name={"toggler-caretdown"} />)
            )}
        </>
    );
    const defaultText = <OverflowText>{text || placeholder}</OverflowText>;
    const textClassName = text ? "" : BlueprintClasses.TEXT_MUTED;
    const togglerTestIds = {
        "data-test-id": dataTestId ? dataTestId + "_toggler" : undefined,
        "data-testid": dataTestid ? dataTestid + "_toggler" : undefined,
    };

    const defaultTarget = filterable ? (
        <Button
            text={defaultText}
            alignText="left"
            outlined
            fill={otherSelectProps.fill ?? false}
            disabled={otherSelectProps.disabled ?? false}
            icon={icon}
            rightIcon={defaultRightIcon}
            textClassName={textClassName}
            {...togglerTestIds}
        />
    ) : (
        // The combobox gets focus and the label, so the target only needs the look of a button.
        // Its text stays part of the combobox and is announced as the selected value.
        <span
            className={classNames(
                `${eccgui}-button`,
                BlueprintClasses.BUTTON,
                BlueprintClasses.OUTLINED,
                BlueprintClasses.ALIGN_LEFT,
                {
                    [BlueprintClasses.FILL]: otherSelectProps.fill,
                    [BlueprintClasses.DISABLED]: otherSelectProps.disabled,
                },
            )}
            {...togglerTestIds}
        >
            {typeof icon === "string" ? <Icon name={icon} /> : icon}
            <span className={classNames(BlueprintClasses.BUTTON_TEXT, textClassName)}>{defaultText}</span>
            {defaultRightIcon}
        </span>
    );

    const target = children ?? defaultTarget;

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
                                      // Escape may still have a pending animation-frame focus restoration.
                                      keepTabDestination(tabDestination);
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
                                keepTabDestination(tabDestination);
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
            {target}
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
