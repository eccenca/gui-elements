import React from "react";
import {
    Classes as BlueprintClasses,
    Popover as BlueprintPopover,
    PopoverInteractionKind as InteractionKind,
    PopoverProps as BlueprintPopoverProps,
    Utils as BlueprintUtils,
} from "@blueprintjs/core";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface ContextOverlayProps extends Omit<BlueprintPopoverProps, "position"> {
    /**
     * `target` element to use as toggler for the overlay display.
     */
    children?: React.JSX.Element;
    /**
     * Type of counter property to `Modal.forceTopPosition`.
     * Use it when you need to display modal dialogs out of the context overlay.
     */
    preventTopPosition?: boolean;
    /**
     * Use the overlay target as placeholder before the real `<ContextOverlay /` is rendered on first hover or focus event.
     * Currently experimental.
     */
    usePlaceholder?: boolean;
}

/**
 * Element displays connected content by interacting with a target element.
 * Full list of available option can be seen at https://blueprintjs.com/docs/#popover2-package/popover2
 */
export const ContextOverlay = ({
    children,
    portalClassName,
    preventTopPosition,
    className = "",
    usePlaceholder = false,
    ...otherPopoverProps
}: ContextOverlayProps) => {
    const placeholderRef = React.useRef<HTMLElement>(null);
    const eventMemory = React.useRef<undefined | "mouseenter" | "focusin" | "click">(undefined);
    const swapDelay = React.useRef<null | NodeJS.Timeout>(null);
    const interactionKind = React.useRef<InteractionKind>(otherPopoverProps.interactionKind ?? InteractionKind.CLICK);
    const swapDelayTime = 15;
    const [placeholder, setPlaceholder] = React.useState<boolean>(
        // use placeholder only for "simple" overlays without special states
        !otherPopoverProps.disabled &&
            !otherPopoverProps.defaultIsOpen &&
            !otherPopoverProps.isOpen &&
            otherPopoverProps.renderTarget === undefined &&
            usePlaceholder
    );

    const swap = (ev: MouseEvent | globalThis.FocusEvent) => {
        const waitForClick =
            interactionKind.current === InteractionKind.CLICK ||
            interactionKind.current === InteractionKind.CLICK_TARGET_ONLY;

        if (swapDelay.current) {
            clearTimeout(swapDelay.current);
        }

        const replacePlaceholder = () => {
            eventMemory.current = ev.type as "mouseenter" | "focusin" | "click";
            setPlaceholder(false);
        };

        if (waitForClick) {
            ev.stopImmediatePropagation();
            replacePlaceholder();
            return;
        }

        swapDelay.current = setTimeout(
            replacePlaceholder,
            // we delay the swap for hover/focus to prevent unwanted effects
            // (e.g. event hickup after replacing elements when it is not really necessary)
            swapDelayTime
        );
    };

    React.useEffect(() => {
        interactionKind.current = otherPopoverProps.interactionKind ?? InteractionKind.CLICK;
        const waitForClick =
            interactionKind.current === InteractionKind.CLICK ||
            interactionKind.current === InteractionKind.CLICK_TARGET_ONLY;
        const removeEvents = () => {
            if (placeholderRef.current) {
                placeholderRef.current.removeEventListener("click", swap);
                placeholderRef.current.removeEventListener("mouseenter", swap);
                placeholderRef.current.removeEventListener("focusin", swap);
            }
            return;
        };
        if (placeholderRef.current) {
            removeEvents(); // remove events in case of interaction kind changed during existence
            if (waitForClick) {
                placeholderRef.current.addEventListener("click", swap);
            } else {
                placeholderRef.current.addEventListener("mouseenter", swap);
                placeholderRef.current.addEventListener("focusin", swap);
            }
            return () => {
                removeEvents();
            };
        }
        return () => {};
    }, [!!placeholderRef.current, otherPopoverProps.interactionKind]);

    const refocus = React.useCallback((node:any) => {
        const target = node?.targetRef.current.children[0];
        if (!eventMemory.current || !target) {
            return;
        }
        switch (eventMemory.current) {
            case "focusin":
                target.focus();
                break;
            case "click":
                target.click();
                break;
            case "mouseenter":
                // re-check if the cursor is still over the element after swapping the placeholder before triggering the event to bubble up
                (target as HTMLElement).addEventListener(
                    "mouseover",
                    () => (target as HTMLElement).dispatchEvent(new MouseEvent("mouseover", { bubbles: true })),
                    {
                        capture: true,
                        once: true,
                    }
                );
                break;
        }
    }, []);

    const targetClassName = `${eccgui}-contextoverlay` + (className ? ` ${className}` : "");

    const displayPlaceholder = () => {
        const PlaceholderElement = otherPopoverProps?.targetTagName ?? (otherPopoverProps?.fill ? "div" : "span");
        const childTarget = BlueprintUtils.ensureElement(React.Children.toArray(children)[0]);
        if (!childTarget) {
            return null;
        }
        return React.createElement(
            PlaceholderElement,
            {
                ...otherPopoverProps?.targetProps,
                className: `${BlueprintClasses.POPOVER_TARGET} ${targetClassName} ${eccgui}-contextoverlay__wrapper--placeholder`,
                ref: placeholderRef,
            },
            React.cloneElement(childTarget, {
                ...childTarget.props,
                className:
                    childTarget.props.className ?? "" + (otherPopoverProps.fill ? ` ${BlueprintClasses.FILL}` : ""),
                tabIndex:
                    childTarget.props.tabIndex ??
                    (!otherPopoverProps?.disabled && otherPopoverProps?.openOnTargetFocus ? 0 : undefined),
            })
        );
    };

    const portalClassNameFinal =
        (preventTopPosition ? `${eccgui}-contextoverlay__portal--lowertop` : "") +
        (portalClassName ? ` ${portalClassName}` : "");

    return placeholder ? (
        displayPlaceholder()
    ) : (
        <BlueprintPopover
            placement="bottom"
            {...otherPopoverProps}
            className={targetClassName}
            portalClassName={portalClassNameFinal.trim() ?? undefined}
            ref={refocus}
        >
            {children}
        </BlueprintPopover>
    );
};

export default ContextOverlay;
