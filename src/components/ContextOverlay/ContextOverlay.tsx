import React from "react";
import {
    Classes as BlueprintClasses,
    Popover as BlueprintPopover,
    PopoverProps as BlueprintPopoverProps,
    Utils as BlueprintUtils,
} from "@blueprintjs/core";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface ContextOverlayProps extends Omit<BlueprintPopoverProps, "position"> {
    /**
     * `target` element to use as toggler for the overlay display.
     */
    children?: JSX.Element;
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
    const placeholderRef = React.useRef(null);
    const eventmemory = React.useRef<undefined | "afterhover" | "afterfocus">(undefined);
    const [placeholder, setPlaceholder] = React.useState<boolean>(
        // use placeholder only for "simple" overlays without special states
        (!otherPopoverProps?.disabled ||
            !!otherPopoverProps?.defaultIsOpen ||
            !!otherPopoverProps?.isOpen ||
            !otherPopoverProps?.renderTarget) &&
            usePlaceholder
    );

    const targetClassName = `${eccgui}-contextoverlay` + (className ? ` ${className}` : "");

    React.useEffect(() => {
        if (placeholderRef.current) {
            const swap = (ev: MouseEvent | globalThis.FocusEvent) => {
                eventmemory.current = ev.type === "focusin" ? "afterfocus" : "afterhover";
                setPlaceholder(false);
            };
            (placeholderRef.current as HTMLElement).addEventListener("mouseenter", swap);
            (placeholderRef.current as HTMLElement).addEventListener("focusin", swap);
        }
    }, [!!placeholderRef.current]);

    const refocus = React.useCallback((node) => {
        if (eventmemory.current === "afterfocus" && node) {
            const target = node.targetRef.current.children[0];
            if (target) {
                target.focus();
            }
        }
    }, []);

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
                className: `${BlueprintClasses.POPOVER_TARGET} ${targetClassName}`,
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
