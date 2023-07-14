import React from 'react';
import {
    Popover2 as BlueprintPropover,
    Popover2Props as BlueprintPopoverProps,
} from "@blueprintjs/popover2";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface ContextOverlayProps extends Omit<BlueprintPopoverProps, "position"> {
    /**
     * `target` element to use as toggler for the overlay display.
     */
    children?: JSX.Element;
}

/**
 * Element displays connected content by interacting with a target element.
 * Full list of available option can be seen at https://blueprintjs.com/docs/#popover2-package/popover2
 */
export const ContextOverlay = ({
    children,
    className='',
    ...restProps
}: ContextOverlayProps) => {

    return (
        <BlueprintPropover
            placement="bottom"
            {...restProps}
            className={`${eccgui}-contextoverlay ` + className}
        >
            {children}
        </BlueprintPropover>
    )
}

export default ContextOverlay;
