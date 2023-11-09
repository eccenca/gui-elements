import React from "react";
import { Popover2 as BlueprintPopover, Popover2Props as BlueprintPopoverProps } from "@blueprintjs/popover2";

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
    ...restProps
}: ContextOverlayProps) => {
    return (
        <BlueprintPopover
            placement="bottom"
            {...restProps}
            className={`${eccgui}-contextoverlay` + (className ? ` ${className}` : "")}
            portalClassName={
                (preventTopPosition ? `${eccgui}-contextoverlay__portal--lowertop` : "") +
                (portalClassName ? ` ${portalClassName}` : "")
            }
        >
            {children}
        </BlueprintPopover>
    );
};

export default ContextOverlay;
